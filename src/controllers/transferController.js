const models = require('../models/mysql');
const Transfer = models.transfers;
const TransferItem = models.transfer_items;
const Location = models.locations;
const Product = models.products;
const User = models.users;
const { Op } = require("sequelize");
const paginate = require('../utils/pagination/paginate');

module.exports = {
    add: async (req, res) => {
        const { reference_number, from_location_id, to_location_id, notes, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required' });
        }

        if (from_location_id === to_location_id) {
            return res.status(400).json({ success: false, message: 'Source and destination locations cannot be the same' });
        }

        const t = await models.sequelize.transaction();

        try {
            const transfer = await Transfer.create({
                reference_number,
                from_location_id,
                to_location_id,
                notes,
                created_by: req.user.user_id
            }, { transaction: t });

            for (const item of items) {
                await TransferItem.create({
                    transfer_id: transfer.id,
                    product_id: item.product_id,
                    quantity: item.quantity
                }, { transaction: t });
            }

            await t.commit();
            res.status(201).json({ success: true, data: transfer });

        } catch (error) {
            await t.rollback();
            res.status(400).json({ success: false, message: error.message });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { reference_number, from_location_id, to_location_id, notes, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Items are required' });
        }

        if (from_location_id === to_location_id) {
            return res.status(400).json({ success: false, message: 'Source and destination locations cannot be the same' });
        }

        const t = await models.sequelize.transaction();

        try {
            const transfer = await Transfer.findByPk(id);
            if (!transfer) {
                await t.rollback();
                return res.status(404).json({ success: false, message: 'Transfer not found' });
            }

            await transfer.update({
                reference_number,
                from_location_id,
                to_location_id,
                notes
            }, { transaction: t });

            await TransferItem.destroy({ 
                where: { transfer_id: id }, 
                transaction: t 
            });

            for (const item of items) {
                await TransferItem.create({
                    transfer_id: id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    notes: item.notes || null
                }, { transaction: t });
            }

            await t.commit();
            res.status(200).json({ 
                success: true, 
                data: {
                    ...transfer.toJSON(),
                    items
                }
            });

        } catch (error) {
            await t.rollback();
            res.status(400).json({ 
                success: false, 
                message: error.message
            });
        }
    },

    getAll: async (req, res) => {
        const { page, size, search } = req.query;
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { reference_number: { [Op.like]: `%${search}%` } }
            ];
        }

        try {
            const transfers = await Transfer.findAll({
                ...paginate(page, size),
                where: whereClause,
                include: [
                    {
                        model: TransferItem,
                        as: 'items',
                        include: [
                            {
                                model: Product,
                                as: 'product'
                            }
                        ]
                    },
                    {
                        model: Location,
                        as: 'from_location',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Location,
                        as: 'to_location',
                        attributes: ['id', 'name']
                    },
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'first_name', 'last_name']
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            res.status(200).json({ success: true, data: transfers });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req, res) => {
        const t = await models.sequelize.transaction();
        try {
            const transfer = await Transfer.findByPk(req.params.id);

            if (!transfer) {
                return res.status(404).json({ success: false, message: 'Transfer not found' });
            }

            await TransferItem.destroy({ where: { transfer_id: transfer.id }, transaction: t });
            await Transfer.destroy({ where: { id: transfer.id }, transaction: t });

            await t.commit();
            res.status(200).json({ success: true, message: 'Transfer deleted successfully' });

        } catch (error) {
            await t.rollback();
            res.status(500).json({ success: false, message: error.message });
        }
    }
};