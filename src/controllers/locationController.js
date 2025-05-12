const models = require('../models/mysql')
const Location = models.locations;

module.exports = {
    // Create a new location
    Add: async (req, res) => {
        try {
            const { name, address, is_primary } = req.body;

            const location = await Location.create({
                name,
                address,
                is_primary: is_primary || false
            });

            res.status(201).json({ success: true, data: location });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Get all locations
    getAll: async (req, res) => {
        try {
            const locations = await Location.findAll();
            res.status(200).json({ success: true, data: locations });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get a single location by ID
    getLocation: async (req, res) => {
        try {
            const location = await Location.findByPk(req.params.id);
            if (!location) {
                return res.status(404).json({ success: false, message: 'Location not found' });
            }
            res.status(200).json({ success: true, data: location });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update a location
    update: async (req, res) => {
        try {
            const { name, address, is_primary } = req.body;
            const location = await Location.findByPk(req.params.id);
            if (!location) {
                return res.status(404).json({ success: false, message: 'Location not found' });
            }

            await location.update({ name, address, is_primary });
            res.status(200).json({ success: true, data: location });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // Delete a location
    delete: async (req, res) => {
        try {
            const location = await Location.findByPk(req.params.id);
            if (!location) {
                return res.status(404).json({ success: false, message: 'Location not found' });
            }

            await location.destroy();
            res.status(200).json({ success: true, message: 'Location deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
