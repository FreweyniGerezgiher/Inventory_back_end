const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../models/mysql');
const { accessTokenSecret } = require('../config/auth');
const User = models.users;
const { err, success } = require('../utils/responses');
const paginate = require('../utils/pagination/paginate');

module.exports = {
    // Register a new user
    addUser: async (req, res) => {
        try {
            const { first_name, last_name, email, password, location_id } = req.body;

            // Check if email already exists
            const existing = await User.findOne({ where: { email } });
            if (existing) {
                return res.status(409).json(err('', 'Email already exists'));
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                location_id
            };

            const created = await User.create(user);

            res.status(201).json(success(created, 'User registered successfully'));

        } catch (e) {
            console.error(e);
            res.status(500).json(err('', 'User registration failed'));
        }
    },

    // Login user and generate JWT token
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log(email, password)

            // Find user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json(err('', 'User not found'));
            }

            // Compare password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json(err('', 'Invalid password'));
            }

            // Create JWT token
            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                accessTokenSecret,
                { expiresIn: '1h' }
            );

            res.status(200).json(success({ accessToken }, 'Login successful'));

        } catch (e) {
            res.status(400).json(err('', e.message));
        }
    },

    // Get user by ID
    getUser: async (req, res) => {
        try {
            let id = req.params.id;
            const user = await User.findOne({ where: { id } });
            if (!user) return res.status(404).json(err('', 'User not found'));
            res.status(200).json(success(user, ''));
        } catch (e) {
            res.status(400).json(err('', e.message));
        }
    },

    // Update user status
    updateStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const user = await User.findOne({ where: { id: req.params.id } });
            if (!user) return res.status(404).json(err('', 'User not found'));

            // Update user status
            user.status = status;
            await user.save();

            res.status(200).json(success(user, 'User status updated successfully'));
        } catch (e) {
            res.status(400).json(err('', e.message));
        }
    },

    // Get all users with pagination
    getAllUsers: async (req, res) => {
        try {
            let { page, size } = req.query;
            const users = await User.findAndCountAll({ 
                ...paginate(page, size), 
                order: [['created_at', 'DESC']] 
            });

            res.status(200).json(success(users, ''));
        } catch (e) {
            res.status(400).json(err('', e.message));
        }
    },

    // Update user details
    updateUser: async (req, res) => {
        try {
            const { first_name, last_name, email, location_id } = req.body;
            const user = await User.findOne({ where: { id: req.params.id } });
            if (!user) return res.status(404).json(err('', 'User not found'));

            // Update user details
            user.first_name = first_name || user.first_name;
            user.last_name = last_name || user.last_name;
            user.email = email || user.email;
            user.location_id = location_id || user.location_id;

            await user.save();

            res.status(200).json(success(user, 'User updated successfully'));
        } catch (e) {
            res.status(400).json(err('', e.message));
        }
    },

    // Delete a user
    deleteUser: async (req, res) => {
        try {
            const user = await User.findOne({ where: { id: req.params.id } });
            if (!user) return res.status(404).json(err('', 'User not found'));

            // Delete the user
            await user.destroy();

            res.status(200).json(success('', 'User deleted successfully'));
        } catch (e) {
            res.status(400).json(err('', e.message));
        }
    }
};
