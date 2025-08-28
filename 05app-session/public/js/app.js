const chatBox = document.getElementById('chat-box');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// WebSocketサーバーに接続
const ws = new WebSocket(`ws://${window.location.host}`);

// 接続が開いたときのイベント
ws.addEventListener('open', () => {
  addSystemMessage('サーバーに接続しました。');
});

// サーバーからメッセージを受信したときのイベント
ws.addEventListener('message', (event) => {
  addChatMessage(event.data);
});

// 接続が閉じたときのイベント
ws.addEventListener('close', () => {
  addSystemMessage('サーバーとの接続が切れました。');
});

// フォームが送信されたときのイベント
messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    // サーバーにメッセージを送信
    ws.send(message);
    // 自分の画面にも送信したメッセージを表示（サーバーからの返信を待たずに表示）
    addChatMessage(message, true);
    messageInput.value = '';
  }
});

// チャットメッセージをボックスに追加する関数
function addChatMessage(message, isSentByMe = false) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  // 自分が送信したメッセージか、他人から受信したメッセージかでスタイルを分ける（今回は簡易的にサーバーからの返信を待たずに判定）
  // 実際のアプリでは、サーバーから誰が送信したかの情報を含めてもらうのが一般的
  if (isSentByMe) {
    messageElement.style.backgroundColor = '#dcf8c6';
    messageElement.style.marginLeft = 'auto';
  } else {
    messageElement.style.backgroundColor = '#e9e9eb';
    messageElement.style.marginRight = 'auto';
  }
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// システムメッセージをボックスに追加する関数
function addSystemMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.textAlign = 'center';
    messageElement.style.color = '#888';
    messageElement.style.fontStyle = 'italic';
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}