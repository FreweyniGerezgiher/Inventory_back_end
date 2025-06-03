const models = require('../models/mysql');
const Sale = models.sales;
const SaleItem = models.sales_items;
const Location = models.locations;
const Product = models.products;
const { Op, Sequelize, col } = require("sequelize");
const ProductStock = models.product_stocks;

module.exports = {

    add: async (req, res) => {
    const { customer_name, total_amount, reference_number, location_id, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Items are required' });
    }

    const t = await models.sequelize.transaction();

    try {
        const sale = await Sale.create({
        customer_name,
        total_amount,
        location_id,
        reference_number,
        created_by: req.user.user_id
        }, { transaction: t });

        for (const item of items) {
        await SaleItem.create({
            sale_id: sale.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
        }, { transaction: t });

        // Decrease product stock
        const stock = await ProductStock.findOne({
            where: { product_id: item.product_id, location_id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!stock) {
            throw new Error(`Stock not found for product ${item.product_id} at location ${location_id}`);
        }

        if (stock.quantity_in_stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${item.product_id}`);
        }

        await stock.update({
            quantity_in_stock: stock.quantity_in_stock - item.quantity
        }, { transaction: t });
        }

        await t.commit();
        res.status(201).json({ success: true, data: sale });

    } catch (error) {
        await t.rollback();
        res.status(400).json({ success: false, message: error.message });
    }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { customer_name, total_amount, reference_number, location_id, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required' });
        }

        const t = await models.sequelize.transaction();

        try {
            const sale = await Sale.findByPk(id, {
            include: [{ model: SaleItem, as: 'items' }],
            transaction: t
            });

            if (!sale) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Sale not found' });
            }

            // Restore previous stock
            for (const oldItem of sale.items) {
            const stock = await ProductStock.findOne({
                where: { product_id: oldItem.product_id, location_id },
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (stock) {
                await stock.update({
                quantity_in_stock: stock.quantity_in_stock + oldItem.quantity
                }, { transaction: t });
            }
            }

            await sale.update({ customer_name, reference_number, total_amount, location_id }, { transaction: t });
            await SaleItem.destroy({ where: { sale_id: id }, transaction: t });

            // Apply new sale items
            for (const item of items) {
            await SaleItem.create({
                sale_id: id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.quantity * item.unit_price,
                updated_by: req.user.user_id
            }, { transaction: t });

            const stock = await ProductStock.findOne({
                where: { product_id: item.product_id, location_id },
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!stock || stock.quantity_in_stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${item.product_id}`);
            }

            await stock.update({
                quantity_in_stock: stock.quantity_in_stock - item.quantity
            }, { transaction: t });
            }

            await t.commit();
            res.status(200).json({ success: true, data: sale });

        } catch (error) {
            await t.rollback();
            res.status(400).json({ success: false, message: error });
        }
     },

    getAll: async (req, res) => {
        const { role, location_id } = req.user; 

        const { search } = req.query;

        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { customer_name: { [Op.like]: `%${search}%` } },
                { reference_number: { [Op.like]: `%${search}%` } }
            ];
        }

        if (role !== 'Admin') {
        whereClause.location_id = location_id;
        }

        try {
            const sales = await Sale.findAll({
                where: whereClause,
                include: [
                    {
                        model: SaleItem,
                        as: 'items',
                        include: [{
                            model: Product,
                            as: 'product'
                        }]
                    },
                    {
                        model: Location,
                        as: 'location'
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            res.status(200).json({ success: true, data: sales });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getSalesStats: async (req, res) => {
            const { role, location_id } = req.user;

            const whereClause = {};

            if (role !== 'Admin') {
                whereClause.location_id = location_id;
            }

            try {
                // Get both count and sum in a single query
                const stats = await Sale.findOne({
                    where: whereClause,
                    attributes: [
                        [Sequelize.fn('count', Sequelize.col('id')), 'totalSales'],
                        [Sequelize.fn('sum', Sequelize.col('total_amount')), 'totalAmount']
                    ],
                    raw: true
                });

                res.status(200).json({ 
                    success: true, 
                    data: {
                        totalSales: parseInt(stats?.totalSales || 0),
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
        const sale = await Sale.findByPk(req.params.id, {
        include: [{ model: SaleItem, as: 'items' }],
        transaction: t
        });

        if (!sale) {
        return res.status(404).json({ success: false, message: 'Sale not found' });
        }

        // Restore stock
        for (const item of sale.items) {
        const stock = await ProductStock.findOne({
            where: { product_id: item.product_id, location_id: sale.location_id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (stock) {
            await stock.update({
            quantity_in_stock: stock.quantity_in_stock + item.quantity
            }, { transaction: t });
        }
        }

        await SaleItem.destroy({ where: { sale_id: sale.id }, transaction: t });
        await Sale.destroy({ where: { id: sale.id }, transaction: t });

        await t.commit();
        res.status(200).json({ success: true, message: 'Sale deleted successfully' });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
    }

};
