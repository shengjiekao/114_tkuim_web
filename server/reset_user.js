const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const uri = 'mongodb://finaltest-admin:finaltest-pass@127.0.0.1:27017/finaltest?authSource=finaltest';

async function resetUser() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const email = 'cc@gmail.com';
        const password = '123456'; // Default password

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Find and update or create
        const result = await User.findOneAndUpdate(
            { email },
            {
                name: 'Admin CC',
                email,
                password: hashedPassword,
                role: 'admin'
            },
            { upsert: true, new: true }
        );

        console.log('User updated/created successfully:');
        console.log(`Email: ${result.email}`);
        console.log(`Password: ${password}`);
        console.log(`Role: ${result.role}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

resetUser();
