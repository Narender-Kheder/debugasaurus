function getWebviewContent () {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat Interface</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: #000000;
      color: white;
    }
    .chat-window {
      flex-grow: 1;
      padding: 15px;
      overflow-y: auto;
      border: 1px solid #333;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .chat-message {
      max-width: 70%;
      padding: 15px 20px;
      border-radius: 20px;
      font-size: 18px;
      word-wrap: break-word;
    }
    .chat-message.user {
      align-self: flex-end;
      background-color: #1e90ff;
      color: white;
      border-bottom-right-radius: 0;
    }
    .chat-message.assistant {
      align-self: flex-start;
      background-color: #444;
      color: white;
      border-bottom-left-radius: 0;
    }
    .chat-message.loading {
      align-self: flex-start;
      background-color: transparent;
      font-style: italic;
      color: #888;
    }
    .chat-input {
      display: flex;
      border-top: 1px solid #333;
      padding: 15px;
      background-color: #111111;
    }
    .chat-input input {
      flex-grow: 1;
      padding: 15px;
      border: 1px solid #333;
      border-radius: 10px;
      margin-right: 10px;
      outline: none;
      font-size: 16px;
      color: white;
      background-color: #222;
    }
    .chat-input input::placeholder {
      color: #888;
    }
    .chat-input button {
      padding: 15px 20px;
      border: none;
      border-radius: 10px;
      background-color: #1e90ff;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }
    .chat-input button:disabled {
      background-color: #555;
      cursor: not-allowed;
    }
    /* Added styles for code formatting */
    .code {
      background-color: #2e2e2e;
      color: #f1f1f1;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      white-space: pre-wrap; /* Ensure wrapping of long lines */
      word-wrap: break-word;
      max-width: 100%;
      overflow-x: auto; /* Allow horizontal scrolling if needed */
    }
  </style>
</head>
<body>
  <div class="chat-window" id="chat-window"></div>
  <div class="chat-input">
    <input type="text" id="message-input" placeholder="Type a message..." />
    <button id="send-button">Send</button>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    const chatWindow = document.getElementById('chat-window');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    let isWaitingForResponse = false;

    function setSendButtonState(disabled) {
      sendButton.disabled = disabled;
      if (disabled) {
        sendButton.textContent = "Loading...";
      } else {
        sendButton.textContent = "Send";
      }
    }

    function sendMessage() {
      const message = messageInput.value;
      if (message && !isWaitingForResponse) {
        addMessageToWindow('user', message);
        vscode.postMessage({ command: 'sendMessage', text: message });
        messageInput.value = '';

        // Disable the send button and add loading indicator
        isWaitingForResponse = true;
        setSendButtonState(true);
        addLoadingIndicator();
      }
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.command === 'receiveMessage') {
        removeLoadingIndicator();
        addMessageToWindow('assistant', message.text);

        // Enable the send button after receiving a response
        isWaitingForResponse = false;
        setSendButtonState(false);
      }
    });

    function addMessageToWindow(sender, text) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('chat-message', sender);

      // Check if the message is code and wrap it in a pre tag
      if (sender === 'assistant' && isCode(text)) {
        const pre = document.createElement('pre');
        pre.classList.add('code');
        pre.textContent = text;
        messageDiv.appendChild(pre);
      } else {
        messageDiv.textContent = text;
      }

      chatWindow.appendChild(messageDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function isCode(text) {
      // A simple check for code (you can expand it based on your needs)
      return text.includes('\`\`\`') || text.startsWith('\`\`\`') || text.endsWith('\`\`\`');
    }

    function addLoadingIndicator() {
      const loadingDiv = document.createElement('div');
      loadingDiv.classList.add('chat-message', 'loading');
      loadingDiv.id = 'loading-indicator';
      loadingDiv.textContent = "...";
      chatWindow.appendChild(loadingDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function removeLoadingIndicator() {
      const loadingDiv = document.getElementById('loading-indicator');
      if (loadingDiv) {
        chatWindow.removeChild(loadingDiv);
      }
    }
  </script>
</body>
</html>

	`
}

module.exports = {
  getWebviewContent
}
