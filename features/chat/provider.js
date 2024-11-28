const vscode = require('vscode')
const llm = require('./llmAgent.js')
const chatInterface = require('./chatInterface.js')

function provider (context) {
  return vscode.commands.registerCommand('debugasourus.startChat', () => {
    const editor = vscode.window.activeTextEditor
    const panel = vscode.window.createWebviewPanel(
      'chatInterface',
      'Chat Interface',
      vscode.ViewColumn.Two,
      { enableScripts: true }
    )
    panel.webview.html = chatInterface.getWebviewContent()

    panel.webview.onDidReceiveMessage(
      async message => {
        if (message.command === 'sendMessage') {
          const userMessage = message.text
          const response = await llm.queryLLM(userMessage,  editor.document)
          panel.webview.postMessage({
            command: 'receiveMessage',
            text: response
          })
        }
      },
      undefined,
      context.subscriptions
    )
  })
}


module.exports = {
  provider
}
