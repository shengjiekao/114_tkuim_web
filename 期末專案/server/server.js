require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../client')); // Serve static files from client folder

// Database Connection
const seedEvents = require('./seedEvents');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await seedEvents();
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

const eventsRouter = require('./routes/events');
const registrationsRouter = require('./routes/registrations');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Campus Event System API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
