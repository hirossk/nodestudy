const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

// --- データベース接続設定 ---
// !!! 必ず自分の環境に合わせて変更してください !!!
const dbConfig = {
  host: 'localhost',
  user: 'root', // MariaDBのユーザー名
  password: 'password', // MariaDBのパスワード
  database: 'todo_app_db'
};

let connection;

// --- ミドルウェア ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// --- APIルーティング (CRUD) ---

// [GET] /api/tasks - 全てのタスクを取得
app.get('/api/tasks', async (req, res) => {
  try {
    const [tasks] = await connection.execute('SELECT * FROM tasks ORDER BY id');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'データベースエラー' });
  }
});

// [POST] /api/tasks - 新しいタスクを作成
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'タイトルは必須です' });
  }
  try {
    const [result] = await connection.execute('INSERT INTO tasks (title) VALUES (?)', [title]);
    const newTaskId = result.insertId;
    const [rows] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [newTaskId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'データベースエラー' });
  }
});

// [PUT] /api/tasks/:id - タスクの状態 (completed) を更新
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    await connection.execute('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id]);
    const [rows] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'データベースエラー' });
  }
});

// [DELETE] /api/tasks/:id - タスクを削除
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await connection.execute('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(204).send(); // 成功したがコンテンツはない
  } catch (err) {
    res.status(500).json({ error: 'データベースエラー' });
  }
});


// --- サーバー起動 ---
async function startServer() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('データベースに接続しました。');
    app.listen(port, () => {
      console.log(`サーバーが起動しました。 http://localhost:${port}`);
    });
  } catch (err) {
    console.error('データベース接続に失敗しました:', err);
  }
}

startServer();