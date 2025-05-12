const models = require('../models/mysql');
const Sale = models.sales;
const SaleItem = models.sales_items;

module.exports = {
    // Add a new sale with items
    add: async (req, res) => {
        const { customer_name, total_amount, location_id, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required' });
        }

        const t = await models.sequelize.transaction();

        try {
            const sale = await Sale.create({
                customer_name,
                total_amount,
                location_id
            }, { transaction: t });

            for (const item of items) {
                await SaleItem.create({
                    sale_id: sale.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_price: item.quantity * item.unit_price
                }, { transaction: t });
            }

            await t.commit();
            res.status(201).json({ success: true, data: sale });
        } catch (error) {
            await t.rollback();
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Get all sales with items
    getAll: async (req, res) => {
        try {
            const sales = await Sale.findAll({
                include: [{ model: SaleItem, as: 'items' }]
            });

            res.status(200).json({ success: true, data: sales });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get a sale by ID
    getById: async (req, res) => {
        try {
            const sale = await Sale.findByPk(req.params.id, {
                include: [{ model: SaleItem, as: 'items' }]
            });

            if (!sale) {
                return res.status(404).json({ success: false, message: 'Sale not found' });
            }

            res.status(200).json({ success: true, data: sale });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Delete a sale and its items
    delete: async (req, res) => {
        const t = await models.sequelize.transaction();

        try {
            const sale = await Sale.findByPk(req.params.id);

            if (!sale) {
                return res.status(404).json({ success: false, message: 'Sale not found' });
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
