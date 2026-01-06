const fetch = require('node-fetch'); // Might need to install node-fetch or use native fetch if node 18+

async function checkApi() {
    try {
        console.log('Fetching from API...');
        const res = await fetch('http://localhost:3000/api/events');
        const data = await res.json();
        console.log('API Status:', res.status);
        console.log('Success:', data.success);
        console.log('Data Length:', data.data ? data.data.length : 0);
        if (data.data && data.data.length > 0) {
            console.log('First Event:', data.data[0].title);
        }
    } catch (e) {
        console.error('API Error:', e);
    }
}

// polyfill for node < 18 if needed, but assuming modern node
if (!global.fetch) {
    console.log('Node version might be old, strictly using local verification');
}
checkApi();
