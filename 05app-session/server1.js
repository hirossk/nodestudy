const express = require('express');
const session = require('express-session');

const app = express();
const port = 3000;

// セッション設定
app.use(session({
    secret: 'a-secret-key-for-session', // セッションIDの署名に使うキー
    resave: false,
    saveUninitialized: true,
}));

let counter = 0;
// ルートURL ('/') へのアクセス処理
app.get('/', (req, res) => {
    // セッションオブジェクトに `views` というプロパティがなければ初期化
    if (req.session.views) {
        // 2回目以降のアクセスなら、カウンターを1増やす
        req.session.views++;
    } else {
        // 初回アクセスなら、カウンターを1に設定
        req.session.views = 1;
    }
    counter++;
    // 現在のカウンターをHTMLとして表示
    res.send(`<h1>訪問回数: ${req.session.views} 回,total: ${counter}</h1><p>ページをリロードしてみてください。</p>`);
});

// サーバーを起動
app.listen(port, () => {
    console.log(`[server1.js] サーバーが起動しました。 http://localhost:${port}`);
});
