
const http = require('http');
const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');
const session = require('express-session');

const app = express();
const port = 3000;

// --- セッション設定 ---
const sessionParser = session({
  secret: 'your-secret-key', // 本番環境では複雑な文字列に変更してください
  resave: false,
  saveUninitialized: false
});

// --- ミドルウェア ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(sessionParser); // Expressアプリでセッションを利用

// --- HTTPルーティング ---

// ログイン処理
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    // セッションにユーザー情報を保存
    req.session.user = { name: username };
    res.json({ success: true, username: username });
  } else {
    res.status(400).json({ success: false, message: 'ユーザー名が必要です' });
  }
});

// ログイン状態を確認するAPI
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.name });
  } else {
    res.json({ loggedIn: false });
  }
});


// --- サーバー設定 ---
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true }); // HTTPサーバーには直接アタッチしない

// WebSocketの接続アップグレード処理をフック
server.on('upgrade', (request, socket, head) => {
  // まずHTTPリクエストとしてセッション情報を解析
  sessionParser(request, {}, () => {
    if (!request.session.user) {
      // セッションがない（未ログイン）場合は接続を拒否
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // セッションがある場合のみWebSocket接続を確立
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
});


// WebSocketの接続イベント処理
wss.on('connection', (ws, request) => {
  // requestオブジェクトからセッション情報を取得し、wsオブジェクトに紐付ける
  ws.user = request.session.user;
  console.log(`クライアントが接続しました: ${ws.user.name}`);

  // 接続時に参加メッセージを全員に送信
  broadcast(JSON.stringify({ type: 'info', message: `${ws.user.name}さんが参加しました。` }));

  // メッセージ受信時の処理
  ws.on('message', (message) => {
    const messageString = message.toString();
    console.log(`[${ws.user.name}] 受信: ${messageString}`);

    // 送信者の名前を付けてメッセージをブロードキャスト
    const chatMessage = {
      type: 'chat',
      username: ws.user.name,
      message: messageString
    };
    broadcast(JSON.stringify(chatMessage));
  });

  // 接続が閉じたときの処理
  ws.on('close', () => {
    console.log(`クライアントとの接続が切れました: ${ws.user.name}`);
    // 退出メッセージを全員に送信
    broadcast(JSON.stringify({ type: 'info', message: `${ws.user.name}さんが退出しました。` }));
  });
});

// ブロードキャスト関数
function broadcast(data) {
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  }
}

// HTTPサーバーを起動
server.listen(port, () => {
  console.log(`サーバーが起動しました。 http://localhost:${port}`);
});
