const http = require('http');
const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
const port = 3000;

// publicフォルダを静的ファイル配信に設定
app.use(express.static(path.join(__dirname, 'public')));

// ExpressアプリからHTTPサーバーを作成
const server = http.createServer(app);

// HTTPサーバーにWebSocketサーバーをアタッチ
const wss = new WebSocketServer({ server });

// WebSocketサーバーの接続イベントを処理
wss.on('connection', (ws) => {
  console.log('クライアントが接続しました。');

  // クライアントからメッセージを受信したときの処理
  ws.on('message', (message) => {
    const messageString = message.toString();
    console.log(`受信: ${messageString}`);

    // ブロードキャスト: 接続している全てのクライアントにメッセージを送信
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(messageString);
      }
    });
  });

  ws.on('close', () => {
    console.log('クライアントとの接続が切れました。');
  });

  ws.on('error', (error) => {
    console.error('WebSocketエラー:', error);
  });
});

// HTTPサーバーを起動
server.listen(port, () => {
  console.log(`サーバーが起動しました。 http://localhost:${port}`);
});