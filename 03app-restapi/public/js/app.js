const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const taskTitleInput = document.getElementById('task-title');

// サーバーからタスクを取得して画面に表示する関数
async function fetchAndRenderTasks() {
  try {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();

    // リストを一旦空にする
    taskList.innerHTML = '';

    // 取得したタスクをリスト項目として追加
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.title;
      if (task.completed) {
        li.style.textDecoration = 'line-through';
      }
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error('タスクの取得に失敗しました:', error);
  }
}

// フォームが送信されたときの処理
addTaskForm.addEventListener('submit', async (event) => {
  // フォームのデフォルトの送信動作（ページリロード）を防ぐ
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title }),
    });

    if (response.ok) {
      // 入力欄を空にする
      taskTitleInput.value = '';
      // タスクリストを再描画する
      fetchAndRenderTasks();
    } else {
      console.error('タスクの追加に失敗しました');
    }
  } catch (error) {
    console.error('通信エラー:', error);
  }
});

// ページが読み込まれたときに最初のタスクリストを取得
fetchAndRenderTasks();