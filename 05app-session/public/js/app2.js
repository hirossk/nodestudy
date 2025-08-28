const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const welcomeMessage = document.getElementById('welcome-message');
const chatBox = document.getElementById('chat-box');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

let ws;

// ログインフォームの処理
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (!username) return;

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  const data = await response.json();
  if (data.success) {
    enterChat(data.username);
  }
});

// チャット画面に入室し、WebSocket接続を開始する関数
function enterChat(username) {
  loginContainer.style.display = 'none';
  chatContainer.style.display = 'block';
  welcomeMessage.textContent = `ようこそ、${username}さん`;

  // WebSocket接続を開始
  ws = new WebSocket(`ws://${window.location.host}`);

  ws.addEventListener('open', () => console.log('WebSocket接続が確立しました。'));
  ws.addEventListener('close', () => addMessageToBox({ type: 'info', message: 'サーバーとの接続が切れました。' }));
  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    addMessageToBox(data);
  });
}

// メッセージ送信フォームの処理
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message && ws) {
    ws.send(message);
    messageInput.value = '';
  }
});

// チャットボックスにメッセージを追加する関数
function addMessageToBox(data) {
  const div = document.createElement('div');
  if (data.type === 'chat') {
    div.className = 'chat-message';
    div.innerHTML = `<span class="username">${data.username}:</span> ${data.message}`;
  } else if (data.type === 'info') {
    div.className = 'info-message';
    div.textContent = data.message;
  }
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ページ読み込み時にログイン状態を確認
(async () => {
  const response = await fetch('/api/user');
  const data = await response.json();
  if (data.loggedIn) {
    enterChat(data.username);
  }
})();