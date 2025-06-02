const models = require('../models/mysql');
const Sale = models.sales;
const SaleItem = models.sales_items;
const Location = models.locations;
const Product = models.products;
const { Op } = require("sequelize");

module.exports = {
    add: async (req, res) => {
        const { customer_name, total_amount, reference_number, location_id, items } = req.body;
        console.log(reference_number);
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
            // Update the Sale record
            const sale = await Sale.findByPk(id);
            if (!sale) {
                await t.rollback();
                return res.status(404).json({ success: false, message: 'Sale not found' });
            }

            await sale.update({ customer_name, reference_number, total_amount, location_id }, { transaction: t });

            // Delete existing SaleItems
            await SaleItem.destroy({ where: { sale_id: id }, transaction: t });

            // Re-insert new SaleItems
            for (const item of items) {
                await SaleItem.create({
                    sale_id: id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_price: item.quantity * item.unit_price
                }, { transaction: t });
            }

            await t.commit();
            res.status(200).json({ success: true, data: sale });

        } catch (error) {
            await t.rollback();
            res.status(400).json({ success: false, message: error.message });
        }
    },
    getAll: async (req, res) => {
        const { search } = req.query;

        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { customer_name: { [Op.like]: `%${search}%` } },
                { reference_number: { [Op.like]: `%${search}%` } }
            ];
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
