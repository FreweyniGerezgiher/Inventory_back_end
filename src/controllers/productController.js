const models = require('../models/mysql')
const Product = models.products;

module.exports = {
    // Create a new product
    add: async (req, res) => {
        try {
            const {
                name, category_id, sku,
                cost_price, selling_price,
                is_taxable, is_active,
                image_url
            } = req.body;

            const product = await Product.create({
                name,
                category_id,
                sku,
                cost_price,
                selling_price,
                is_taxable: is_taxable || false,
                is_active: is_active !== false, // default true
                image_url
            });

            res.status(201).json({ success: true, data: product });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Get all products
    getAll: async (req, res) => {
        try {
            const products = await Product.findAll();
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get product by ID
    getById: async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update a product
    update: async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            await product.update(req.body);
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Delete a product
    delete: async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            await product.destroy();
            res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
