const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/events - Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json({ success: true, data: events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/events - Create event
router.post('/', async (req, res) => {
    const { title, description, date, location, maxParticipants } = req.body;
    try {
        const newEvent = new Event({ title, description, date, location, maxParticipants });
        const savedEvent = await newEvent.save();
        res.status(201).json({ success: true, data: savedEvent, message: 'Event created successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT /api/events/:id - Update event
router.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, data: updatedEvent, message: 'Event updated successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
