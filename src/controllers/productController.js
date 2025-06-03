const models = require('../models/mysql')
const Product = models.products;
const productStocks = models.product_stocks;
const Location = models.locations;
const ProductCategory = models.product_categories;
const { Op, col, Sequelize } = require('sequelize');

module.exports = {
    add: async (req, res) => {
        try {
            const {
          name, category_id, brand, model_number, selling_price, reorder_point, description } = req.body;

            const product = await Product.create({
                name,
                category_id,
                brand,
                model_number,
                selling_price,
                reorder_point,
                description
            });

            res.status(201).json({ success: true, data: product });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    getAll: async (req, res) => {
        const { location_id } = req.user;
        
        try {
            const products = await Product.findAll({
            include: [
                { 
                model: ProductCategory, 
                as: 'category' 
                },
                {
                model: productStocks,
                as: 'stocks',
                where: { location_id },
                required: false,
                attributes: ['quantity_in_stock']
                }
            ],
            attributes: {
                include: [
                [Sequelize.literal('COALESCE(stocks.quantity_in_stock, 0)'), 'current_stock']
                ]
            }
            });

            // Alternative approach if you want to keep the nested structure
            const formattedProducts = products.map(product => ({
            ...product.get({ plain: true }),
            current_stock: product.stocks?.[0]?.quantity_in_stock || 0
            }));

            res.status(200).json({ success: true, data: formattedProducts });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
        },
    getOutOfStock: async (req, res) => {
    try {
        const { role, location_id } = req.user; 

        const whereClause = {
        quantity_in_stock: {
            [Op.lte]: col('product.reorder_point')
        }
        };

        if (role !== 'Admin') {
        whereClause.location_id = location_id;
        }

        const outOfStockItems = await productStocks.findAll({
        include: [
            {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'brand', 'model_number', 'reorder_point']
            },
            {
            model: Location,
            as: 'location',
            attributes: ['id', 'name']
            }
        ],
        where: whereClause,
        order: [['quantity_in_stock', 'ASC']]
        });

        res.status(200).json({ success: true, data: outOfStockItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch out-of-stock products' });
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
