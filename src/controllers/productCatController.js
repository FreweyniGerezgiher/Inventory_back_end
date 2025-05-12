const models = require('../models/mysql');
const Category = models.product_categories;

module.exports = {
    // Create a new category
    add: async (req, res) => {
        try {
            const { name } = req.body;

            const category = await Category.create({ name });

            res.status(201).json({ success: true, data: category });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Get all categories
    getAll: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get category by ID
    getById: async (req, res) => {
        try {
            const category = await Category.findByPk(req.params.id);
            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update a category
    update: async (req, res) => {
        try {
            const { name } = req.body;
            const category = await Category.findByPk(req.params.id);

            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }

            await category.update({ name });
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Delete a category
    delete: async (req, res) => {
        try {
            const category = await Category.findByPk(req.params.id);

            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }

            await category.destroy();
            res.status(200).json({ success: true, message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
