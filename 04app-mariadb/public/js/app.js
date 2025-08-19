const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const taskTitleInput = document.getElementById('task-title');

// タスクをリスト項目としてレンダリングする関数
function renderTask(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  if (task.completed) {
    li.classList.add('completed');
  }

  const span = document.createElement('span');
  span.textContent = task.title;
  // タスク名クリックで完了状態をトグル
  span.addEventListener('click', () => toggleTask(task.id, !task.completed));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '削除';
  deleteBtn.className = 'delete-btn';
  // 削除ボタンクリックでタスクを削除
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// サーバーから全タスクを取得して表示
async function fetchAndRenderTasks() {
  const response = await fetch('/api/tasks');
  const tasks = await response.json();
  taskList.innerHTML = '';
  tasks.forEach(renderTask);
}

// 新しいタスクを追加
addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;

  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (response.ok) {
    taskTitleInput.value = '';
    fetchAndRenderTasks();
  }
});

// タスクの完了状態を更新
async function toggleTask(id, completed) {
  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  fetchAndRenderTasks();
}

// タスクを削除
async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
  fetchAndRenderTasks();
}

// 初期表示
fetchAndRenderTasks();