const models = require('../models/mysql')
const Product = models.products;
const ProductCategory = models.product_categories;
module.exports = {
    add: async (req, res) => {
        try {
            const { name, category_id, sku, cost_price, selling_price, is_taxable, is_active, image_url } = req.body;

            const product = await Product.create({
                name,
                category_id,
                sku,
                cost_price,
                selling_price,
                is_taxable: is_taxable || false,
                is_active: is_active !== false,
                image_url
            });

            res.status(201).json({ success: true, data: product });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const products = await Product.findAll({
                include: [{ model: ProductCategory, as: 'category' }]
            }
            );
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

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
