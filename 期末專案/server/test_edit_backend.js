const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');

const uri = 'mongodb://finaltest-admin:finaltest-pass@127.0.0.1:27017/finaltest?authSource=finaltest';

async function testEditEvent() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // 1. Get an existing event
        const event = await Event.findOne();
        if (!event) {
            console.log('No events found to edit.');
            return;
        }
        console.log(`Original Title: ${event.title}`);

        // 2. Simulate User Input (Update Title)
        const newTitle = `Updated Title ${Date.now()}`;

        // 3. Simulate Backend Update Logic (findByIdAndUpdate)
        // This mirrors the code in routes/events.js: router.put('/:id', ...)
        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            { title: newTitle },
            { new: true }
        );

        if (updatedEvent.title === newTitle) {
            console.log('Update SUCCESS on backend!');
            console.log(`New Title: ${updatedEvent.title}`);

            // Revert changes
            await Event.findByIdAndUpdate(event._id, { title: event.title });
            console.log('Reverted changes.');
        } else {
            console.error('Update FAILED on backend.');
        }

    } catch (err) {
        console.error('Test Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

testEditEvent();
