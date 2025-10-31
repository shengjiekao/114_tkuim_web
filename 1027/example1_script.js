// example1_script.js
// 統一在父層監聽點擊與送出事件，處理清單項目新增/刪除/完成

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// Enter 送出（在輸入框 keyup 偵測）
input.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    form.requestSubmit(); 
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  const item = document.createElement('li');
  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  item.innerHTML = `
    <span class="todo-text">${value}</span>
    <div class="btn-group btn-group-sm">
      <button class="btn btn-outline-success" data-action="toggle">完成</button>
      <button class="btn btn-outline-danger" data-action="remove">刪除</button>
    </div>
  `;
  list.appendChild(item);
  input.value = '';
  input.focus();
});

list.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;

  const item = btn.closest('li');
  if (!item) return;

  const action = btn.getAttribute('data-action');

  if (action === 'remove') {
    item.remove();
    return;
  }

  if (action === 'toggle') {
    const done = item.classList.toggle('list-group-item-success');
    const text = item.querySelector('.todo-text');
    if (text) text.style.textDecoration = done ? 'line-through' : 'none';
    btn.textContent = done ? '取消完成' : '完成';
  }
});
