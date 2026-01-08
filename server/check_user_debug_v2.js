const mongoose = require('mongoose');
const User = require('./models/User');

// Hardcode URI to avoid dotenv issues if any
const uri = 'mongodb://root:example@localhost:27017/campus_events?authSource=admin';

async function checkUser() {
    try {
        await mongoose.connect(uri);
        console.log('--- DB CHECK START ---');

        const count = await User.countDocuments();
        console.log(`Total users: ${count}`);

        const user = await User.findOne({ email: 'cc@gmail.com' });
        if (user) {
            console.log('FOUND USER cc@gmail.com');
            console.log('Role:', user.role);
            console.log('Hash:', user.password);
        } else {
            console.log('USER cc@gmail.com NOT FOUND');
            const all = await User.find();
            all.forEach(u => console.log(`Existing: ${u.email} (${u.role})`));
        }
        console.log('--- DB CHECK END ---');
    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();
