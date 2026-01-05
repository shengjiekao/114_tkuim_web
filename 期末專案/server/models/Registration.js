const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    // Allows for tracking when the registration happened
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate registration for the same event by the same user
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
