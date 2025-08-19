// 1. expressモジュールをインポートします
const express = require('express');

// 2. expressアプリケーションのインスタンスを作成します
const app = express();

// 3. サーバーがリッスンするポート番号を定義します
const port = 3000;

// 4. ルーティングを設定します
// HTTP GETメソッドで、ルートURL ('/') にアクセスがあった場合の処理を定義します
// req: リクエストオブジェクト (クライアントからの情報)
// res: レスポンスオブジェクト (クライアントへ返す情報)
app.get('/', (req, res) => {
  // `res.send()` を使って、クライアントに文字列を送信します
  res.send('Hello, Express Server!');
});

// 5. 指定したポートでサーバーを起動し、リクエストを待ち受けます
app.listen(port, () => {
  // サーバーが起動したときに、コンソールにメッセージを表示します
  console.log(`サーバーが起動しました。 http://localhost:${port} で待機中です。`);
});
