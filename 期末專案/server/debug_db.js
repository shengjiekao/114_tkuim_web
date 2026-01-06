require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

async function check() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const count = await Event.countDocuments();
        console.log('Event Count:', count);

        if (count === 0) {
            console.log('Attempting manual seed...');
            const defaultEvents = [
                {
                    title: "Debug Event",
                    description: "Test event",
                    date: new Date(),
                    location: "Test Loc",
                    maxParticipants: 100
                }
            ];
            await Event.insertMany(defaultEvents);
            console.log('Manual seed done.');
        } else {
            const events = await Event.find();
            console.log('Events found:', events.map(e => e.title));
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
