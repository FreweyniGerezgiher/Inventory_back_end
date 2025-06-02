const models = require('../models/mysql');
const ProductStock = models.product_stocks;

module.exports = {
    // Get all product stock entries
    getAll: async (req, res) => {
        try {
            const stocks = await ProductStock.findAll();
            res.status(200).json({ success: true, data: stocks });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
