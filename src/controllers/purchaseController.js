const models = require('../models/mysql');
const Purchase = models.purchases;
const PurchaseItem = models.purchase_items;
const Location = models.locations;
const Product = models.products;
const Supplier = models.suppliers;
module.exports = {
    add: async (req, res) => {
        const { user_id, supplier_id, total_amount, location_id, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required' });
        }

        const t = await models.sequelize.transaction();

        try {
            const purchase = await Purchase.create({
                user_id,
                supplier_id,
                total_amount,
                location_id,
            }, { transaction: t });

            for (const item of items) {
                await PurchaseItem.create({
                    purchase_id: purchase.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_price: item.quantity * item.unit_price
                }, { transaction: t });
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
        const { user_id, supplier_id, total_amount, location_id, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required' });
        }

        const t = await models.sequelize.transaction();

        try {
            const purchase = await Purchase.findByPk(id);
            if (!purchase) {
                await t.rollback();
                return res.status(404).json({ success: false, message: 'Purchase not found' });
            }

            await purchase.update({
                user_id,
                supplier_id,
                total_amount,
                location_id
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
            res.status(400).json({ 
                success: false, 
                message: error.message,
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    },

    getAll: async (req, res) => {
        try {
            const purchases = await Purchase.findAll({
                include: [{ model: PurchaseItem, as: 'items', 
                    include: [{
                        model: Product,
                        as: 'product'
                }]}, { model: Location, as: 'location' }, {model: Supplier, as: 'supplier'}]
            });

            res.status(200).json({ success: true, data: purchases });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const purchase = await Purchase.findByPk(req.params.id, {
                include: [{ model: PurchaseItem, as: 'items' }]
            });

            if (!purchase) {
                return res.status(404).json({ success: false, message: 'Purchase not found' });
            }

            res.status(200).json({ success: true, data: purchase });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req, res) => {
        const t = await models.sequelize.transaction();
        try {
            const purchase = await Purchase.findByPk(req.params.id);

            if (!purchase) {
                return res.status(404).json({ success: false, message: 'Purchase not found' });
            }

            await PurchaseItem.destroy({ where: { purchase_id: purchase.id }, transaction: t });
            await Purchase.destroy({ where: { id: purchase.id }, transaction: t });

            await t.commit();
            res.status(200).json({ success: true, message: 'Purchase deleted successfully' });

        } catch (error) {
            await t.rollback();
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
