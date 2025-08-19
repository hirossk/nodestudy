
const express = require('express');
const path = require('path'); // ファイルパスを扱うためのモジュール

const app = express();
const port = 3000;

// --- ミドルウェアの設定 ---

// 1. 静的ファイルを提供するフォルダとして 'public' を指定
app.use(express.static(path.join(__dirname, 'public')));

// 2. テンプレートエンジンとしてEJSを使用することを設定
app.set('view engine', 'ejs');
// EJSテンプレートが置かれているフォルダとして 'views' を指定
app.set('views', path.join(__dirname, 'views'));


// --- サンプルデータ ---
// 本来はデータベースから取得するが、今回は配列で代用
const users = [
  { id: 1, name: '佐藤', email: 'sato@example.com' },
  { id: 2, name: '鈴木', email: 'suzuki@example.com' },
  { id: 3, name: '高橋', email: 'takahashi@example.com' }
];


// --- ルーティングの設定 ---

// ルートURL ('/') へのアクセスは、public/index.html が自動的に表示される

// '/users' ページへのGETリクエスト (動的なページ)
app.get('/users', (req, res) => {
  // 'users.ejs' テンプレートをレンダリングする
  // 第2引数のオブジェクトで、テンプレート内で使用するデータを渡す
  res.render('users', {
    title: 'ユーザー一覧',
    users: users // usersというキーで、users配列を渡す
  });
});

// '/users/:id' ページへのGETリクエスト (URLパラメータを使った動的なページ)
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10); // URLからIDを取得し、数値に変換
  const user = users.find(u => u.id === userId);

  if (user) {
    res.send(`<h1>${user.name}さんの情報</h1><p>Email: ${user.email}</p><a href="/users">一覧に戻る</a>`);
  } else {
    res.status(404).send('ユーザーが見つかりません');
  }
});


// --- サーバーの起動 ---
app.listen(port, () => {
  console.log(`サーバーが起動しました。 http://localhost:${port} で待機中です。`);
});
