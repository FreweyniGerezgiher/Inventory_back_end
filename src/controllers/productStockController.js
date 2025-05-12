const models = require('../models/mysql');
const ProductStock = models.product_stocks;

module.exports = {
    // Create new product stock
    add: async (req, res) => {
        try {
            const { product_id, location_id, quantity_in_stock, reorder_level } = req.body;

            const stock = await ProductStock.create({
                product_id,
                location_id,
                quantity_in_stock: quantity_in_stock || 0,
                reorder_level: reorder_level || 10
            });

            res.status(201).json({ success: true, data: stock });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Get all product stock entries
    getAll: async (req, res) => {
        try {
            const stocks = await ProductStock.findAll();
            res.status(200).json({ success: true, data: stocks });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get stock by ID
    getById: async (req, res) => {
        try {
            const stock = await ProductStock.findByPk(req.params.id);
            if (!stock) {
                return res.status(404).json({ success: false, message: 'Stock entry not found' });
            }
            res.status(200).json({ success: true, data: stock });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update stock
    update: async (req, res) => {
        try {
            const { product_id, location_id, quantity_in_stock, reorder_level } = req.body;
            const stock = await ProductStock.findByPk(req.params.id);

            if (!stock) {
                return res.status(404).json({ success: false, message: 'Stock entry not found' });
            }

            await stock.update({
                product_id,
                location_id,
                quantity_in_stock,
                reorder_level
            });

            res.status(200).json({ success: true, data: stock });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Delete stock
    delete: async (req, res) => {
        try {
            const stock = await ProductStock.findByPk(req.params.id);
            if (!stock) {
                return res.status(404).json({ success: false, message: 'Stock entry not found' });
            }

            await stock.destroy();
            res.status(200).json({ success: true, message: 'Stock entry deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
