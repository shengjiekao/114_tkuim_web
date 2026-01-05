const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

// POST /api/registrations - Register for an event
router.post('/', async (req, res) => {
    const { userId, eventId } = req.body;
    try {
        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        // Check already registered (handled by unique index too, but good to check)
        const existingReg = await Registration.findOne({ userId, eventId });
        if (existingReg) return res.status(400).json({ success: false, message: 'User already registered for this event' });

        const newRegistration = new Registration({ userId, eventId });
        await newRegistration.save();
        res.status(201).json({ success: true, data: newRegistration, message: 'Registration successful' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// GET /api/registrations/user/:userId - Get user's registrations
router.get('/user/:userId', async (req, res) => {
    try {
        const registrations = await Registration.find({ userId: req.params.userId }).populate('eventId');
        res.json({ success: true, data: registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/registrations/event/:eventId - Get event's registrations (Admin)
router.get('/event/:eventId', async (req, res) => {
    try {
        const registrations = await Registration.find({ eventId: req.params.eventId }).populate('userId');
        res.json({ success: true, data: registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/registrations/:id - Cancel registration
router.delete('/:id', async (req, res) => {
    try {
        const deletedReg = await Registration.findByIdAndDelete(req.params.id);
        if (!deletedReg) return res.status(404).json({ success: false, message: 'Registration not found' });
        res.json({ success: true, message: 'Registration cancelled' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
