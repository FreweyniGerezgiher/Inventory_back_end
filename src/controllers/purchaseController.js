const models = require('../models/mysql');
const Purchase = models.purchases;
const PurchaseItem = models.purchase_items;
const Location = models.locations;
const Product = models.products;
const Supplier = models.suppliers;
const { Op,Sequelize } = require("sequelize");
const paginate = require('../utils/pagination/paginate')
const ProductStock = models.product_stocks;

module.exports = {

        add: async (req, res) => {
        const { supplier_id, reference_number, total_amount, location_id, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required' });
        }

        const t = await models.sequelize.transaction();

        try {
            const purchase = await Purchase.create({
            supplier_id,
            reference_number,
            total_amount,
            location_id,
            created_by: req.user.user_id
            }, { transaction: t });

            for (const item of items) {
            await PurchaseItem.create({
                purchase_id: purchase.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.quantity * item.unit_price
            }, { transaction: t });

            const stock = await ProductStock.findOne({
                where: { product_id: item.product_id, location_id },
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (stock) {
                await stock.update({
                quantity_in_stock: stock.quantity_in_stock + item.quantity
                }, { transaction: t });
            } else {
                await ProductStock.create({
                product_id: item.product_id,
                location_id,
                quantity_in_stock: item.quantity
                }, { transaction: t });
            }
            }

            await t.commit();
            res.status(201).json({ success: true, data: purchase });

        } catch (error) {
            await t.rollback();
            res.status(400).json({ success: false, message: error.message });
        }
        },


    update: async (req, res) => {
  const { id } = req.params;
  const { supplier_id, reference_number, total_amount, location_id, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Items are required' });
  }

  const t = await models.sequelize.transaction();

  try {
    const purchase = await Purchase.findByPk(id, {
      include: [{ model: PurchaseItem, as: 'items' }],
      transaction: t
    });

    if (!purchase) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }

    // Revert previous stock
    for (const oldItem of purchase.items) {
      const stock = await ProductStock.findOne({
        where: { product_id: oldItem.product_id, location_id },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (stock) {
        await stock.update({
          quantity_in_stock: stock.quantity_in_stock - oldItem.quantity
        }, { transaction: t });
      }
    }

    await purchase.update({
      supplier_id,
      total_amount,
      reference_number,
      location_id,
      updated_by: req.user.user_id
    }, { transaction: t });

    await PurchaseItem.destroy({
      where: { purchase_id: id },
      transaction: t
    });

    for (const item of items) {
      await PurchaseItem.create({
        purchase_id: id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }, { transaction: t });

      const stock = await ProductStock.findOne({
        where: { product_id: item.product_id, location_id },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (stock) {
        await stock.update({
          quantity_in_stock: stock.quantity_in_stock + item.quantity
        }, { transaction: t });
      } else {
        await ProductStock.create({
          product_id: item.product_id,
          location_id,
          quantity_in_stock: item.quantity
        }, { transaction: t });
      }
    }

    await t.commit();
    res.status(200).json({
      success: true,
      data: {
        ...purchase.toJSON(),
        items
      }
    });

  } catch (error) {
    await t.rollback();
    res.status(400).json({ success: false, message: error.message });
  }
},

    getAll: async (req, res) => {
        const { page, size, search } = req.query;
        const { role, location_id } = req.user; 

        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { reference_number: { [Op.like]: `%${search}%` } }
            ];
        }

        if (role !== 'Admin') {
        whereClause.location_id = location_id;
        }

        try {
            const purchases = await Purchase.findAll({
                ...paginate(page, size),
                where: whereClause,
                include: [
                    {
                        model: PurchaseItem,
                        as: 'items',
                        include: [
                            {
                                model: Product,
                                as: 'product'
                            }
                        ]
                    },
                    {
                        model: Location,
                        as: 'location'
                    },
                    {
                        model: Supplier,
                        as: 'supplier'
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            res.status(200).json({ success: true, data: purchases });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getPurchaseStats: async (req, res) => {
    const { role, location_id } = req.user;

    const whereClause = {};

    if (role !== 'Admin') {
        whereClause.location_id = location_id;
    }

    try {
        // Get both count and sum in a single query
        const stats = await Purchase.findOne({
            where: whereClause,
            attributes: [
                [Sequelize.fn('count', Sequelize.col('id')), 'totalPurchases'],
                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'totalAmount']
            ],
            raw: true
        });

        res.status(200).json({ 
            success: true, 
            data: {
                totalPurchases: parseInt(stats?.totalPurchases || 0),
                totalAmount: parseFloat(stats?.totalAmount || 0)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
},

    delete: async (req, res) => {
        const t = await models.sequelize.transaction();

        try {
            const purchase = await Purchase.findByPk(req.params.id, {
            include: [{ model: PurchaseItem, as: 'items' }],
            transaction: t
            });

            if (!purchase) {
            return res.status(404).json({ success: false, message: 'Purchase not found' });
            }

            for (const item of purchase.items) {
            const stock = await ProductStock.findOne({
                where: { product_id: item.product_id, location_id: purchase.location_id },
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (stock) {
                await stock.update({
                quantity_in_stock: stock.quantity_in_stock - item.quantity
                }, { transaction: t });
            }
            }

            await PurchaseItem.destroy({ where: { purchase_id: purchase.id }, transaction: t });
            await Purchase.destroy({ where: { id: purchase.id }, transaction: t });

            await t.commit();
            res.status(200).json({ success: true, message: 'Purchase deleted successfully' });

        } catch (error) {
            await t.rollback();
            res.status(500).json({ success: false, message: error.message });
        }
        },

};
