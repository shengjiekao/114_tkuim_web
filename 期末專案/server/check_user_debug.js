const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://root:example@localhost:27017/campus_events?authSource=admin';

async function checkUser() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'cc@gmail.com' });
        if (user) {
            console.log('User found:', user);
            console.log('Role:', user.role);
            console.log('Password hash:', user.password);
        } else {
            console.log('User cc@gmail.com NOT found.');
            const allUsers = await User.find({}, 'name email role');
            console.log('Existing users:', allUsers);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();
