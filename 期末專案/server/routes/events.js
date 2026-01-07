const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { auth, admin } = require('../middleware/auth');

// GET /api/events - Get all events (Public: active only, Admin: all with filter option)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.includeDeleted !== 'true') {
            filter.isDeleted = { $ne: true };
        }
        const events = await Event.find(filter).sort({ date: 1 });
        res.json({ success: true, data: events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/events/:id - Get single event (Public)
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/events - Create event (Admin only)
router.post('/', auth, admin, async (req, res) => {
    const { title, description, date, location, maxParticipants, image } = req.body;
    try {
        const newEvent = new Event({ title, description, date, location, maxParticipants, image });
        const savedEvent = await newEvent.save();
        res.status(201).json({ success: true, data: savedEvent, message: 'Event created successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT /api/events/:id - Update event (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, data: updatedEvent, message: 'Event updated successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE /api/events/:id - Soft Delete event (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        // Soft delete
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!updatedEvent) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, message: 'Event deleted (softly)', data: updatedEvent });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/events/:id/restore - Restore event (Admin only)
router.put('/:id/restore', auth, admin, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true });
        if (!updatedEvent) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, message: 'Event restored', data: updatedEvent });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
