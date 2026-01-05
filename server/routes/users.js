const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users - Create User (or Mock Login)
router.post('/', async (req, res) => {
    const { name, email, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            // If user exists, return it (Mock Login)
            return res.json({ success: true, data: user, message: 'Current user found' });
        }

        // Create new
        const newUser = new User({ name, email, role: role || 'user' });
        const savedUser = await newUser.save();
        res.status(201).json({ success: true, data: savedUser, message: 'User created' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// GET /api/users - List users (Admin)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
