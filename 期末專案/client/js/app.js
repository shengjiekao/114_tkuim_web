const API_URL = 'http://localhost:3000/api';

// --- Utils ---
async function fetchData(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    } catch (error) {
        alert(error.message);
        console.error(error);
        return null;
    }
}

// --- Event Functions ---
async function loadEvents(containerId, isStudent = true) {
    const result = await fetchData('/events');
    const container = document.getElementById(containerId);
    if (!result || !container) return;

    container.innerHTML = result.data.map(event => `
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">${event.title}</h3>
                <div class="card-subtitle">
                    <span>📅 ${new Date(event.date).toLocaleDateString()}</span>
                    <span>📍 ${event.location}</span>
                </div>
                <p class="card-text">${event.description}</p>
                <div class="card-subtitle">
                   <span>👥 Max: ${event.maxParticipants}</span>
                </div>
                ${isStudent
            ? `<button class="btn" onclick="registerForEvent('${event._id}')">報名參加</button>`
            : `<button class="btn" onclick="openEditModal('${event._id}')">編輯</button>
                       <button class="btn btn-danger" onclick="deleteEvent('${event._id}')">刪除</button>
                       <button class="btn" style="background-color: #6b7280;" onclick="viewRegistrations('${event._id}')">查看報名</button>`
        }
            </div>
        </div>
    `).join('');
}

async function createEvent(eventData) {
    const result = await fetchData('/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
    });
    if (result && result.success) {
        alert('活動建立成功！');
        loadEvents('admin-events-list', false);
        closeModal();
    }
}

async function deleteEvent(id) {
    if (!confirm('確定要刪除此活動嗎？')) return;
    const result = await fetchData(`/events/${id}`, { method: 'DELETE' });
    if (result && result.success) {
        loadEvents('admin-events-list', false);
    }
}

// --- Registration Functions ---
// Hardcoded user ID for demo purposes since we don't have full auth UI yet
// In a real app, this would come from the logged-in user context
const DEMO_USER_ID = "6593456789abcdef12345678"; // We might need to create this user first or handle it dynamically

async function registerForEvent(eventId) {
    // For simplicity in this non-auth demo, we ask for a user ID or just create a random one if not exists?
    // Let's prompt for a User ID to simulate "Logging in" or just use a fixed one if we seeded the DB.
    // Better: Prompt user for Name/Email to "Quick Register" if we want to be fancy, but let's stick to the prompt's API.
    // The prompt says "Student" role. 
    // strategy: We will create a dummy user on the fly or check local storage.

    let userId = localStorage.getItem('userId');
    if (!userId) {
        // Simple mock login flow
        const name = prompt("請輸入您的姓名 (首次使用需註冊):");
        const email = prompt("請輸入您的 Email:");
        if (!name || !email) return;

        // Try to find or create user (This part is tricky without an Auth API, 
        // so we might need a helper endpoint or just assume the user exists if we populated data.
        // BUT, since we changed to simple mode, let's just make a helper to create user if needed or just hardcode for now for the demo flow)

        // Actually, we don't have a "Create User" API in the specific list from the prompt.
        // It says "Users Collection" exists.
        // I will add a small helper in the backend to create a user if not simple, OR just use the ID if known.
        // Let's just prompt for the MongoDB ID for now or (better) let's unimplemented strictly strictly complying to the API list?
        // Wait, the prompt requirements say "User Login" in the Demo part.
        // So I should probably add a simple login/register endpoint or just "Enter User ID".
        // Let's just ask for Name/Email and search/create in the backend (I'll need to modify backend slightly or just use direct DB access in a real app).

        // WORKAROUND: For this "Simple" version without dedicated Auth API:
        // I will assume the user knows their ID or I'll just hardcode one for "Demo Student".
        // userId = prompt("請輸入您的 User ID (測試用):");
    }

    // Let's implement a "Mock Login" in the UI that sets the User ID.
    // implementing in index.html
    userId = localStorage.getItem('userId');
    if (!userId) {
        alert('請先在右上角 "登入" (模擬)');
        return;
    }

    const result = await fetchData('/registrations', {
        method: 'POST',
        body: JSON.stringify({ userId, eventId })
    });

    if (result && result.success) {
        alert('報名成功！');
        loadMyRegistrations(userId);
    }
}

async function loadMyRegistrations(userId) {
    const result = await fetchData(`/registrations/user/${userId}`);
    const container = document.getElementById('my-registrations-list');
    if (!result || !container) return;

    if (result.data.length === 0) {
        container.innerHTML = '<p>尚無報名紀錄。</p>';
        return;
    }

    container.innerHTML = result.data.map(reg => `
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">${reg.eventId.title}</h3>
                <div class="card-subtitle">
                    <span>📅 ${new Date(reg.eventId.date).toLocaleDateString()}</span>
                    <span>📍 ${reg.eventId.location}</span>
                </div>
                <button class="btn btn-danger" onclick="cancelRegistration('${reg._id}', '${userId}')">取消報名</button>
            </div>
        </div>
    `).join('');
}

async function cancelRegistration(regId, userId) {
    if (!confirm('確定要取消報名嗎？')) return;
    const result = await fetchData(`/registrations/${regId}`, { method: 'DELETE' });
    if (result && result.success) {
        alert('已取消報名');
        loadMyRegistrations(userId);
    }
}

// --- Admin Functions ---
async function viewRegistrations(eventId) {
    const result = await fetchData(`/registrations/event/${eventId}`); // Note: detailed in server code but maybe not in prompt list? I added it in server.js 
    if (!result) return;

    const list = result.data.map(r => `<li>${r.userId.name} (${r.userId.email})</li>`).join('') || '<li>尚無人報名</li>';
    alert(`報名名單:\n<ul>${list}</ul>`); // Simple alert for now, or modal
    // Better: show in modal
    const modalContent = document.getElementById('modal-body-content');
    if (modalContent) {
        modalContent.innerHTML = `<h3>報名名單</h3><ul>${list}</ul>`;
        document.getElementById('editModal').classList.add('show');
    }
}
