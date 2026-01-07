const API_URL = 'http://localhost:3000/api';

// --- Utils ---
async function fetchData(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    } catch (error) {
        if (error.message === 'Invalid token' || error.message.includes('jwt')) {
            logout(); // Auto logout on token error
        }
        console.error(error);
        alert(error.message);
        return null;
    }
}

// --- Auth Functions ---
let currentUser = null;

function initAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
        currentUser = JSON.parse(userStr);
    }
    updateUI();
}

function updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const createEventBtn = document.getElementById('createEventBtn');

    if (currentUser) {
        loginBtn.textContent = '登出';
        loginBtn.onclick = logout;
        userInfo.textContent = `Hi, ${currentUser.name} (${currentUser.role === 'admin' ? '管理員' : '學生'})`;
        createEventBtn.style.display = currentUser.role === 'admin' ? 'block' : 'none';

        // Refresh views if needed
        loadEvents('events-list', currentUser.role !== 'admin');
    } else {
        loginBtn.textContent = '登入 / 註冊';
        loginBtn.onclick = openLoginModal;
        userInfo.textContent = '';
        createEventBtn.style.display = 'none';
        loadEvents('events-list', true); // Default view
    }
}

async function login(email, password) {
    const result = await fetchData('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (result && result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        currentUser = result.data.user;
        closeAuthModals();
        updateUI();
        alert('登入成功');
    }
}

async function register(name, email, password, role) {
    const result = await fetchData('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
    });

    if (result && result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        currentUser = result.data.user;
        closeAuthModals();
        updateUI();
        alert('註冊成功');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId'); // Cleanup legacy
    localStorage.removeItem('userRole'); // Cleanup legacy
    localStorage.removeItem('userName'); // Cleanup legacy
    currentUser = null;
    updateUI();
    showSection('events');
    alert('已登出');
}

// --- Modal Logic ---
function openLoginModal() {
    document.body.classList.add('modal-open');
    document.getElementById('loginModal').classList.add('show');
    document.getElementById('registerModal').classList.remove('show');
}

function openRegisterModal() {
    document.body.classList.add('modal-open');
    document.getElementById('registerModal').classList.add('show');
    document.getElementById('loginModal').classList.remove('show');
}

function switchModal(type) {
    if (type === 'login') openLoginModal();
    else openRegisterModal();
}

function closeAuthModals() {
    document.body.classList.remove('modal-open');
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('registerModal').classList.remove('show');
}

// --- Event Functions ---
async function loadEvents(containerId, isStudent = true) {
    let endpoint = '/events';
    if (!isStudent) {
        endpoint += '?includeDeleted=true';
    }

    const result = await fetchData(endpoint);
    const container = document.getElementById(containerId);
    if (!result || !container) return;

    container.innerHTML = result.data.map(event => {
        const isDeleted = event.isDeleted;
        const opacityStyle = isDeleted ? 'opacity: 0.6; filter: grayscale(100%);' : '';
        const statusBadge = isDeleted ? '<span style="background: #e11d48; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">已刪除</span>' : '';

        return `
        <div class="card" style="${opacityStyle}">
            <div class="card-image" style="background-image: url('${(event.image && event.image.startsWith('http')) ? event.image : 'images/' + (event.image || 'default.jpg')}');"></div>
            <div class="card-body">
                <h3 class="card-title">${event.title} ${statusBadge}</h3>
                <div class="card-subtitle">
                    <div class="event-detail"><span>日期：</span>${new Date(event.date).toLocaleDateString()}</div>
                    <div class="event-detail"><span>地點：</span>${event.location}</div>
                    <div class="event-detail"><span>名額：</span>${event.maxParticipants}</div>
                </div>
                ${isStudent
                ? `<button class="btn" onclick="registerForEvent('${event._id}')" ${isDeleted ? 'disabled' : ''}>報名參加</button>`
                : (isDeleted
                    ? `<button class="btn" style="background-color: #22c55e;" onclick="restoreEvent('${event._id}')">復原 (Restore)</button>`
                    : `<button class="btn" onclick="openEditModal('${event._id}')">編輯</button>
                   <button class="btn btn-danger" onclick="deleteEvent('${event._id}')">刪除</button>`)
                + `<button class="btn" style="background-color: #6b7280; margin-top: 5px;" onclick="viewRegistrations('${event._id}')">查看報名</button>`
            }
            </div>
        </div>
    `}).join('');
}

async function createEvent(eventData) {
    const result = await fetchData('/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
    });
    if (result && result.success) {
        alert('活動建立成功！');
        loadEvents('events-list', currentUser.role !== 'admin');
        closeModal();
    }
}

async function deleteEvent(id) {
    if (!confirm('確定要移至垃圾桶嗎？(您可以隨時復原)')) return;
    const result = await fetchData(`/events/${id}`, { method: 'DELETE' });
    if (result && result.success) {
        loadEvents('events-list', false);
    }
}

async function restoreEvent(id) {
    if (!confirm('確定要復原此活動嗎？')) return;
    const result = await fetchData(`/events/${id}/restore`, { method: 'PUT' });
    if (result && result.success) {
        alert('活動已復原');
        loadEvents('events-list', false);
    }
}

// --- Registration Functions ---
async function registerForEvent(eventId) {
    if (!currentUser) {
        alert('請先登入才能報名');
        openLoginModal();
        return;
    }

    if (currentUser.role === 'admin') {
        alert('管理員無法報名活動');
        return;
    }

    const result = await fetchData('/registrations', {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id, eventId })
    });

    if (result && result.success) {
        alert('報名成功！');
    }
}

async function loadMyRegistrations(userId) {
    if (!userId) return;
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
                    <div class="event-detail"><span>日期：</span>${new Date(reg.eventId.date).toLocaleDateString()}</div>
                    <div class="event-detail"><span>地點：</span>${reg.eventId.location}</div>
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
    const result = await fetchData(`/registrations/event/${eventId}`);
    if (!result) return;

    const listContent = document.getElementById('registrations-list-content');
    const modal = document.getElementById('viewRegistrationsModal');

    if (!result.data || result.data.length === 0) {
        listContent.innerHTML = '<p class="text-muted">尚無人報名</p>';
    } else {
        const listHtml = result.data.map(r => `
            <div style="padding: 0.75rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 600;">${r.userId.name}</div>
                    <div style="font-size: 0.85rem; color: #666;">${r.userId.email}</div>
                </div>
            </div>
        `).join('');
        listContent.innerHTML = `<div style="max-height: 300px; overflow-y: auto;">${listHtml}</div>`;
    }

    document.body.classList.add('modal-open');
    modal.classList.add('show');
}

function closeViewModal() {
    document.body.classList.remove('modal-open');
    document.getElementById('viewRegistrationsModal').classList.remove('show');
}

// --- UI & Navigation ---
function showSection(id) {
    document.getElementById('events-section').style.display = 'none';
    document.getElementById('my-registrations-section').style.display = 'none';
    document.getElementById(id + '-section').style.display = 'block';

    // Update Active State
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    // Attempt to find the link that matches. Since we use onclick there isn't a direct link reference easily available without "this"
    // Using a simple heuristic or adding IDs to nav links would be better, but for now:
    const navLinks = document.querySelectorAll('.nav-links a');
    for (const link of navLinks) {
        if (link.getAttribute('onclick') === `showSection('${id}')`) {
            link.classList.add('active');
        }
    }

    if (id === 'events') {
        loadEvents('events-list', !currentUser || currentUser.role !== 'admin');
    }
    if (id === 'my-registrations') {
        if (currentUser) {
            loadMyRegistrations(currentUser.id);
        } else {
            alert('請先登入');
            openLoginModal();
            showSection('events');
        }
    }
}

const editModal = document.getElementById('editModal');

function resetEventForm() {
    document.getElementById('eventId').value = '';
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDesc').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventLocation').value = '';
    document.getElementById('eventImage').value = '';
    document.getElementById('eventMax').value = '50';
}

function openCreateModal() {
    resetEventForm();
    document.body.classList.add('modal-open');
    document.getElementById('editModal').classList.add('show');
}

async function openEditModal(id) {
    const result = await fetchData(`/events/${id}`);
    if (result && result.success) {
        const e = result.data;
        document.getElementById('eventId').value = e._id;
        document.getElementById('eventTitle').value = e.title;
        document.getElementById('eventDesc').value = e.description;
        document.getElementById('eventDate').value = e.date ? e.date.split('T')[0] : '';
        document.getElementById('eventLocation').value = e.location;
        document.getElementById('eventImage').value = e.image || '';
        document.getElementById('eventMax').value = e.maxParticipants;

        document.body.classList.add('modal-open');
        document.getElementById('editModal').classList.add('show');
    } else {
        alert('無法讀取活動資料');
    }
}

function closeModal() {
    document.body.classList.remove('modal-open');
    editModal.classList.remove('show');
}

// Ensure functions are global for HTML onclicks
window.showSection = showSection;
window.openCreateModal = openCreateModal;
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.viewRegistrations = viewRegistrations;
window.closeViewModal = closeViewModal;
window.deleteEvent = deleteEvent;
window.registerForEvent = registerForEvent;
window.cancelRegistration = cancelRegistration;
window.switchModal = switchModal;
window.openLoginModal = openLoginModal;
window.logout = logout;
window.restoreEvent = restoreEvent;


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initAuth();

    // Bind Close Buttons (using IDs added in HTML)
    const closeLoginBtn = document.getElementById('closeLoginModalBtn');
    if (closeLoginBtn) closeLoginBtn.onclick = closeAuthModals;

    const closeRegBtn = document.getElementById('closeRegisterModalBtn');
    if (closeRegBtn) closeRegBtn.onclick = closeAuthModals;

    const closeViewRegBtn = document.getElementById('closeViewRegistrationsModalBtn');
    if (closeViewRegBtn) closeViewRegBtn.onclick = closeViewModal;

    // Bind Switch Buttons
    const toRegBtn = document.getElementById('switchToRegisterBtn');
    if (toRegBtn) toRegBtn.onclick = (e) => { e.preventDefault(); switchModal('register'); };

    const toLoginBtn = document.getElementById('switchToLoginBtn');
    if (toLoginBtn) toLoginBtn.onclick = (e) => { e.preventDefault(); switchModal('login'); };

    // Bind Forms
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
    });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        register(
            document.getElementById('regName').value,
            document.getElementById('regEmail').value,
            document.getElementById('regPassword').value,
            document.getElementById('regRole').value
        );
    });

    document.getElementById('eventForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('eventId').value;
        const data = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDesc').value,
            date: document.getElementById('eventDate').value,
            location: document.getElementById('eventLocation').value,
            image: document.getElementById('eventImage').value,
            maxParticipants: parseInt(document.getElementById('eventMax').value)
        };

        if (id) { // Update
            fetchData(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(res => {
                if (res && res.success) {
                    alert('更新成功');
                    closeModal();
                    loadEvents('events-list', currentUser ? currentUser.role !== 'admin' : true);
                }
            });
        } else { // Create
            createEvent(data);
        }
    });
});
