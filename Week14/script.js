document.addEventListener('DOMContentLoaded', () => {
    // Mock Data for PTT Boards
    const boards = [
        { name: 'Gossiping', category: '綜合', title: '[八卦] 天氣冷注意保暖', users: 24532, hot: true },
        { name: 'Stock', category: '財經', title: '[股版] 台積電法說會', users: 15420, hot: true },
        { name: 'C_Chat', category: '閒聊', title: '[希洽] 本季新番討論', users: 8900, hot: true },
        { name: 'Baseball', category: '運動', title: '[棒球] 經典賽名單公布', users: 6700, hot: true },
        { name: 'NBA', category: '運動', title: '[NBA] 季後賽預測', users: 5400, hot: true },
        { name: 'Lifeismoney', category: '省錢', title: '[省錢] 超商優惠情報', users: 3200, hot: true },
        { name: 'movie', category: '娛樂', title: '[好雷] 沙丘2觀後感', users: 2800, hot: false },
        { name: 'KoreaStar', category: '娛樂', title: '[韓星] 回歸舞台討論', users: 2100, hot: false },
        { name: 'Beauty', category: '表特', title: '[正妹] 今天的正妹', users: 1900, hot: false },
        { name: 'Tech_Job', category: '科技', title: '[請益] Offer請益', users: 1500, hot: false },
        { name: 'PC_Shopping', category: '科技', title: '[情報] 顯卡降價', users: 1200, hot: false },
        { name: 'MobileComm', category: '科技', title: '[心得] Pixel 9使用心得', users: 1100, hot: false },
    ];

    let currentUser = 'guest';

    // DOM Elements
    const hotBoardsContainer = document.getElementById('hot-boards-container');
    const boardListBody = document.getElementById('board-list-body');
    const systemTimeElement = document.getElementById('system-time');
    const searchInput = document.getElementById('search-input');
    const loginBtn = document.getElementById('login-btn');
    const userStatus = document.getElementById('user-status');
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    const modalOkBtn = document.getElementById('modal-ok-btn');

    // === Render Functions ===
    function renderHotBoards() {
        hotBoardsContainer.innerHTML = '';
        const hotBoards = boards.filter(board => board.hot);
        hotBoards.forEach(board => {
            const card = document.createElement('div');
            card.className = 'board-card';
            card.innerHTML = `
                <div class="board-name">${board.name}</div>
                <div class="board-meta">
                    <span class="category-tag">${board.category}</span>
                    <span class="user-count">🔥 ${board.users}</span>
                </div>
                <div class="board-title" style="margin-top: 8px; font-size: 0.9rem; color: #aaa; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                    ${board.title}
                </div>
            `;
            // Add click event
            card.addEventListener('click', () => showEnterBoardModal(board.name));
            hotBoardsContainer.appendChild(card);
        });
    }

    function renderBoardList(filterText = '') {
        boardListBody.innerHTML = '';
        const filteredBoards = boards.filter(board =>
            board.name.toLowerCase().includes(filterText.toLowerCase()) ||
            board.category.includes(filterText) ||
            board.title.includes(filterText)
        );

        if (filteredBoards.length === 0) {
            boardListBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888;">查無相關看板</td></tr>';
            return;
        }

        filteredBoards.forEach(board => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <span style="font-weight: bold; color: #fff;">${board.name}</span>
                </td>
                <td>
                    <span class="category-tag">${board.category}</span>
                </td>
                <td>
                    <span class="board-link">${board.title}</span>
                </td>
                <td class="text-right">
                    <span class="${board.users > 5000 ? 'highlight' : ''}">${board.users}</span>
                </td>
            `;
            // Add click event for the whole row
            tr.addEventListener('click', () => showEnterBoardModal(board.name));
            boardListBody.appendChild(tr);
        });
    }

    // === Interactive Functions ===
    function showModal(message) {
        modalText.textContent = message;
        modal.classList.remove('hidden');
    }

    function showEnterBoardModal(boardName) {
        if (currentUser === 'guest' && boardName === 'Gossiping') {
            showModal(`[禁止] 未滿18歲禁止進入 ${boardName} 板！\n請先登入驗證年齡。`);
        } else {
            showModal(`正在連線至 ${boardName} ...\n\n(模擬連線成功，按確定返回)`);
        }
    }

    function hideModal() {
        modal.classList.add('hidden');
    }

    function handleLogin() {
        if (currentUser === 'guest') {
            const userId = prompt("請輸入代號 (模擬登入，任意輸入即可):", "user123");
            if (userId) {
                currentUser = userId;
                userStatus.textContent = `目前使用者: ${currentUser}`;
                loginBtn.textContent = '登出';
                showModal(`登入成功！\n歡迎回來，${currentUser}。`);
            }
        } else {
            currentUser = 'guest';
            userStatus.textContent = `目前使用者: guest`;
            loginBtn.textContent = '登入';
            showModal("已登出。\nSee you next time!");
        }
    }

    // === Event Listeners ===
    searchInput.addEventListener('input', (e) => {
        renderBoardList(e.target.value);
    });

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogin();
    });

    modalOkBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Initial Render
    renderHotBoards();
    renderBoardList();

    // Update System Time
    function updateTime() {
        const now = new Date();
        systemTimeElement.textContent = now.toLocaleString('zh-TW', { hour12: false });
    }
    updateTime();
    setInterval(updateTime, 1000);
});
