// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const axios = require('axios');

const { checkGitErrors } = require('./features/gitError');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  console.log('Congratulations, your extension "debugasourus" is now active!')

  // const disposable = vscode.commands.registerCommand(
  //   'debugasourus.helloWorld',
  //   function () {
  //     console.log('WE CALLED')
  //     vscode.window.showWarningMessage('Hello World from debugasourus!')
  //   }
  // )
  let disposable = vscode.commands.registerCommand('debugasourus.startChat', () => {
    const panel = vscode.window.createWebviewPanel(
      'chatInterface', 
      'Chat Interface', 
      vscode.ViewColumn.One, 
      { enableScripts: true }
    );
    panel.webview.html = getWebviewContent();

    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'sendMessage') {
          const userMessage = message.text;
          const response = await queryLLM(userMessage);
          panel.webview.postMessage({ command: 'receiveMessage', text: response });
        }
      },
      undefined,
      context.subscriptions
    );
  });

  const gitErrorCheck = vscode.commands.registerCommand(
    'debugasourus.checkGitErrors',
    async function () {
      await checkGitErrors()
    }
  )

  // const doSomething = vscode.commands.registerCommand(
  //   'debugasourus.doSomething',
  //   async function () {
  //     console.log('WE CALLED 2')
  //   }
  // )

  const provider1 = vscode.languages.registerCompletionItemProvider(
    '*',
    {
      provideCompletionItems (document, position) {
        const linePrefix = document
          .lineAt(position)
          .text.slice(0, position.character)

        //   this only works when console. is detected
        if (!linePrefix.endsWith('console.')) {
          return undefined
        }

        // lets just see what the extension can see
        console.log(document.getText())

        return [
          new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('error', vscode.CompletionItemKind.Method)
        ]
      }
    },
    '.' // triggered whenever a '.' is being typed
  )

  context.subscriptions.push(provider1, disposable, gitErrorCheck)
}
async function queryLLM(userMessage) {
  try {
    const apiKey = ''; // Replace with your API key or else it won't work
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: userMessage }],
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chat Interface</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; flex-direction: column; height: 100vh; }
        .chat-window { flex-grow: 1; padding: 10px; overflow-y: auto; border: 1px solid #ddd; }
        .chat-input { display: flex; border-top: 1px solid #ddd; }
        .chat-input input { flex-grow: 1; padding: 10px; border: none; border-right: 1px solid #ddd; }
        .chat-input button { padding: 10px; border: none; background-color: #007acc; color: white; cursor: pointer; }
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

        sendButton.addEventListener('click', () => {
          const message = messageInput.value;
          if (message) {
            addMessageToWindow('User', message);
            vscode.postMessage({ command: 'sendMessage', text: message });
            messageInput.value = '';
          }
        });

        window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.command === 'receiveMessage') {
            addMessageToWindow('Assistant', message.text);
          }
        });

        function addMessageToWindow(sender, text) {
          const messageDiv = document.createElement('div');
          messageDiv.textContent = \`\${sender}: \${text}\`;
          chatWindow.appendChild(messageDiv);
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }
      </script>
    </body>
    </html>
  `;
}


// This method is called when your extension is deactivated
function deactivate () {}

module.exports = {
  activate,
  deactivate
}
