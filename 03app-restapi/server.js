const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// --- ミドルウェア ---
// publicフォルダを静的ファイル配信に設定
app.use(express.static(path.join(__dirname, 'public')));
// POSTリクエストのbodyをJSONとして解析できるようにする
app.use(express.json());

// --- データベースの代わりとなる、サーバーメモリ上のデータ ---
let tasks = [
  { id: 1, title: 'Node.jsの勉強', completed: false },
  { id: 2, title: 'Expressの復習', completed: true },
];
let nextId = 3; // 次に追加されるタスクのID

// --- APIルーティング ---

// [GET] /api/tasks - 全てのタスクをJSONで取得
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// [POST] /api/tasks - 新しいタスクを作成
app.post('/api/tasks', (req, res) => {
  const title = req.body.title;

  if (!title) {
    // titleが空の場合はエラーを返す
    return res.status(400).json({ error: 'タスクのタイトルは必須です' });
  }

  const newTask = {
    id: nextId++,
    title: title,
    completed: false
  };

  tasks.push(newTask);
  
  // 作成成功のステータス(201)と、作成されたタスクの情報を返す
  res.status(201).json(newTask);
});


// --- サーバー起動 ---
app.listen(port, () => {
  console.log(`サーバーが起動しました。 http://localhost:${port}`);
});
