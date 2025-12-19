const API_URL = 'http://localhost:3001';

const state = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
};

// UI Elements
const views = {
    auth: document.getElementById('auth-view'),
    dashboard: document.getElementById('dashboard-view'),
};

const forms = {
    auth: document.getElementById('auth-form'),
    add: document.getElementById('add-form'),
};

const inputs = {
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    roleGroup: document.getElementById('role-group'),
};

const buttons = {
    logout: document.getElementById('logout-btn'),
    authSubmit: document.getElementById('auth-submit-btn'),
};

const elements = {
    authTitle: document.getElementById('auth-title'),
    authSwitchText: document.getElementById('auth-switch-text'),
    authSwitchLink: document.getElementById('auth-switch-link'),
    authError: document.getElementById('auth-error'),
    dashboardError: document.getElementById('dashboard-error'),
    userInfo: document.getElementById('user-info'),
    dataList: document.getElementById('data-list'),
    pagination: document.getElementById('pagination'),
};

let isLoginMode = true;

// Init
function init() {
    render();
    setupEventListeners();
    if (state.token) {
        fetchData();
    }
}

// Event Listeners
function setupEventListeners() {
    elements.authSwitchLink.addEventListener('click', toggleAuthMode);

    forms.auth.addEventListener('submit', handleAuthSubmit);
    forms.add.addEventListener('submit', handleAddSubmit);
    buttons.logout.addEventListener('click', logout);
}

// Helper: Loading State
function setLoading(btn, isLoading, text = 'Loading...') {
    if (isLoading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = text;
        btn.disabled = true;
    } else {
        btn.textContent = btn.dataset.originalText || btn.textContent;
        btn.disabled = false;
    }
}

// Handlers
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    renderAuthView();
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    elements.authError.textContent = '';

    const email = inputs.email.value;
    const password = inputs.password.value;
    const role = document.querySelector('input[name="role"]:checked').value;

    const endpoint = isLoginMode ? '/auth/login' : '/auth/signup';
    const body = { email, password };
    if (!isLoginMode) body.role = role;

    setLoading(buttons.authSubmit, true);

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Authentication failed');

        if (isLoginMode) {
            login(data);
        } else {
            // After signup, switch to login or auto-login? Requirement says signup returns id/email/role.
            // Let's switch to login mode and pre-fill email
            alert('註冊成功，請登入');
            toggleAuthMode();
            inputs.email.value = email;
        }
    } catch (err) {
        elements.authError.textContent = err.message;
    } finally {
        setLoading(buttons.authSubmit, false);
    }
}

function login(data) {
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', state.token);
    localStorage.setItem('user', JSON.stringify(state.user));
    render();
    fetchData();
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    render();
}

async function handleAddSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('add-name').value;
    const email = document.getElementById('add-email').value;
    const phone = document.getElementById('add-phone').value;
    const btn = forms.add.querySelector('button[type="submit"]');

    setLoading(btn, true, '新增中...');

    try {
        const res = await fetch(`${API_URL}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({ name, email, phone })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to add');

        forms.add.reset();
        fetchData(); // Refresh list
    } catch (err) {
        alert(err.message);
    } finally {
        setLoading(btn, false);
    }
}

async function deleteItem(id) {
    if (!confirm('確定要刪除嗎？')) return;

    try {
        const res = await fetch(`${API_URL}/api/signup/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || '刪除失敗');
        }

        fetchData();
    } catch (err) {
        alert(err.message);
    }
}

async function fetchData(page = 1) {
    try {
        const res = await fetch(`${API_URL}/api/signup?page=${page}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });
        const data = await res.json();

        if (res.status === 401 || res.status === 403) {
            logout(); // Token invalid
            return;
        }

        renderList(data);
    } catch (err) {
        elements.dashboardError.textContent = '無法取得資料';
    }
}

// Rendering
function render() {
    if (state.token) {
        views.auth.classList.remove('active');
        views.dashboard.classList.add('active');
        elements.userInfo.textContent = `Hi, ${state.user.role === 'admin' ? '管理員' : '同學'} (${state.user.email})`;
    } else {
        views.dashboard.classList.remove('active');
        views.auth.classList.add('active');
        renderAuthView();
    }
}

function renderAuthView() {
    if (isLoginMode) {
        elements.authTitle.textContent = '登入';
        buttons.authSubmit.textContent = '登入';
        elements.authSwitchText.textContent = '還沒有帳號？';
        elements.authSwitchLink.textContent = '註冊';
        inputs.roleGroup.style.display = 'none';
        forms.auth.reset();
    } else {
        elements.authTitle.textContent = '註冊';
        buttons.authSubmit.textContent = '註冊';
        elements.authSwitchText.textContent = '已有帳號？';
        elements.authSwitchLink.textContent = '登入';
        inputs.roleGroup.style.display = 'block';
    }
}

function renderList(data) {
    const tbody = elements.dataList;
    tbody.innerHTML = '';

    if (!data.list || data.list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">目前沒有資料</td></tr>';
        return;
    }

    data.list.forEach(item => {
        const tr = document.createElement('tr');

        // Check permission to show delete button
        // Admin or Owner
        const canDelete = state.user.role === 'admin' || item.ownerId === state.user.id;

        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td>
                ${canDelete ? `<button class="danger btn-sm" onclick="deleteItem('${item._id}')">刪除</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Pagination (simplified)
    elements.pagination.innerHTML = '';
    for (let i = 1; i <= data.totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === data.page) btn.classList.add('secondary');
        btn.onclick = () => fetchData(i);
        elements.pagination.appendChild(btn);
    }
}

// Expose to window for onclick handlers
window.deleteItem = deleteItem;

init();
