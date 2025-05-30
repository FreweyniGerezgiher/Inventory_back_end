const models = require('../models/mysql');
const { err, success } = require('../utils/responses');

module.exports = {
    addSupplier: async (req, res) => {
        try {
            const { 
                name, 
                company_name, 
                email, 
                phone, 
                alternate_phone, 
                address, 
                bank_name, 
                account_number, 
                notes 
            } = req.body;

            const existing = await models.suppliers.findOne({ 
                where: { 
                    [models.Sequelize.Op.or]: [
                        { name },
                        { email }
                    ]
                } 
            });
            
            if (existing) {
                return res.status(409).json(
                    err('', existing.name === name ? 
                        'Supplier name already exists' : 
                        'Supplier email already exists')
                );
            }

            const supplier = await models.suppliers.create({
                name,
                company_name,
                email,
                phone,
                alternate_phone,
                address,
                bank_name,
                account_number,
                notes,
                is_active: true
            });

            res.status(201).json(success(supplier, 'Supplier created successfully'));

        } catch (e) {
            console.error(e);
            res.status(500).json(err('', 'Supplier creation failed'));
        }
    },

    getAllSuppliers: async (req, res) => {
        try {
            const { is_active } = req.query;
            
            let where = {};
            if (is_active !== undefined) {
                where.is_active = is_active === 'true';
            }

            const suppliers = await models.suppliers.findAll({ 
                where,
                order: [['name', 'ASC']] 
            });

            res.status(200).json(success(suppliers, 'Suppliers fetched successfully'));
        } catch (e) {
            res.status(500).json(err('', e.message));
        }
    },

    getSupplier: async (req, res) => {
        try {
            const supplier = await models.suppliers.findByPk(req.params.id);
            
            if (!supplier) {
                return res.status(404).json(err('', 'Supplier not found'));
            }

            res.status(200).json(success(supplier, ''));
        } catch (e) {
            res.status(400).json(err('', e.message));
        }
    },

    updateSupplier: async (req, res) => {
        try {
            const { 
                name, 
                company_name, 
                email, 
                phone, 
                alternate_phone, 
                address, 
                bank_name, 
                account_number, 
                notes,
                is_active 
            } = req.body;

            const supplier = await models.suppliers.findByPk(req.params.id);
            if (!supplier) {
                return res.status(404).json(err('', 'Supplier not found'));
            }

            if (name || email) {
                const where = {
                    id: { [models.Sequelize.Op.ne]: supplier.id }
                };
                
                if (name) where.name = name;
                if (email) where.email = email;

                const existing = await models.suppliers.findOne({ where });
                if (existing) {
                    return res.status(409).json(
                        err('', existing.name === name ? 
                            'Supplier name already exists' : 
                            'Supplier email already exists')
                    );
                }
            }

            supplier.name = name || supplier.name;
            supplier.company_name = company_name || supplier.company_name;
            supplier.email = email || supplier.email;
            supplier.phone = phone || supplier.phone;
            supplier.alternate_phone = alternate_phone || supplier.alternate_phone;
            supplier.address = address || supplier.address;
            supplier.bank_name = bank_name || supplier.bank_name;
            supplier.account_number = account_number || supplier.account_number;
            supplier.notes = notes || supplier.notes;
            
            if (is_active !== undefined) {
                supplier.is_active = is_active;
            }

            await supplier.save();

            res.status(200).json(success(supplier, 'Supplier updated successfully'));
        } catch (e) {
            res.status(400).json(err('', e.message));
        }
    },

    deleteSupplier: async (req, res) => {
        try {
            const supplier = await models.suppliers.findByPk(req.params.id);
            if (!supplier) {
                return res.status(404).json(err('', 'Supplier not found'));
            }

            await supplier.destroy();
            res.status(200).json(success('', 'Supplier deleted successfully'));
        } catch (e) {
            res.status(400).json(err('', e.message));
        }
    }
};