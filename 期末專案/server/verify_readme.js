// const fetch = require('node-fetch'); // Using native fetch in Node 18+

const BASE_URL = 'http://localhost:3000/api';
let studentToken = '';
let adminToken = '';
let studentId = '';
let adminId = '';
let eventId = '';
let createdEventId = '';

const uniqueSuffix = Date.now(); // To avoid duplicate emails

async function runTest(name, fn) {
    try {
        console.log(`\n--- Testing: ${name} ---`);
        await fn();
        console.log(`✅ ${name} Passed`);
    } catch (error) {
        console.error(`❌ ${name} Failed:`, error.message);
        process.exit(1);
    }
}

async function request(method, endpoint, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
}

(async () => {
    // 1. Student Registration
    await runTest('Student Registration', async () => {
        const res = await request('POST', '/auth/register', {
            name: 'Test Student',
            email: `student_${uniqueSuffix}@test.com`,
            password: 'password123',
            role: 'user'
        });
        studentToken = res.data.token;
        studentId = res.data.user.id;
        console.log('Student Token acquired');
    });

    // 2. Admin Registration
    await runTest('Admin Registration', async () => {
        const res = await request('POST', '/auth/register', {
            name: 'Test Admin',
            email: `admin_${uniqueSuffix}@test.com`,
            password: 'password123',
            role: 'admin'
        });
        adminToken = res.data.token;
        adminId = res.data.user.id;
        console.log('Admin Token acquired');
    });

    // 3. Get Events (Public)
    await runTest('Get Events', async () => {
        const res = await request('GET', '/events');
        if (!res.data || res.data.length === 0) throw new Error('No events found');
        eventId = res.data[0]._id;
        console.log(`Found ${res.data.length} events. Using event ID: ${eventId}`);
    });

    // 4. Register for Event (Student)
    await runTest('Student Register for Event', async () => {
        const res = await request('POST', '/registrations', {
            userId: studentId,
            eventId: eventId
        }, studentToken);
        console.log('Registration ID:', res.data._id);
    });

    // 5. View My Registrations (Student)
    await runTest('View My Registrations', async () => {
        const res = await request('GET', `/registrations/user/${studentId}`, null, studentToken);
        if (res.data.length === 0) throw new Error('Registration not found in list');
        console.log('Found registrations:', res.data.length);
    });

    // 6. Admin Create Event
    await runTest('Admin Create Event', async () => {
        const res = await request('POST', '/events', {
            title: 'Test Event ' + uniqueSuffix,
            description: 'Test Description',
            date: new Date().toISOString(),
            location: 'Test Location',
            maxParticipants: 50,
            image: 'default.jpg'
        }, adminToken);
        createdEventId = res.data._id;
        console.log('Created Event ID:', createdEventId);
    });

    // 7. Admin View Registrations for Event
    await runTest('Admin View Event Registrations', async () => {
        // Checking the first event we registered for
        const res = await request('GET', `/registrations/event/${eventId}`, null, adminToken);
        const registeredUser = res.data.find(r => r.userId._id === studentId || r.userId === studentId); // populate might be used
        if (!registeredUser) throw new Error('Student registration not visible to admin');
        console.log('Admin confirmed student registration.');
    });

    // 8. Admin Delete Event
    await runTest('Admin Delete Event', async () => {
        await request('DELETE', `/events/${createdEventId}`, null, adminToken);
        console.log('Test event deleted.');
    });

    console.log('\n🎉 All README functionalities verified successfully!');
})();
