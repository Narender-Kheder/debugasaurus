const path = require('path')
const vscode = require('vscode')
const llm = require('./llmAgent.js')
const chatInterface = require('./chatInterface.js')

async function provider (context) {
  await llm.loadApiKey()
  return vscode.commands.registerCommand('debugasourus.startChat', () => {
    const editor = vscode.window.activeTextEditor
    const panel = vscode.window.createWebviewPanel(
      'chatInterface',
      'Chat-asourus',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'views')),
          vscode.Uri.file('views/debugasourus.png') // Allow access to the views folder
        ]
      }
    )
    panel.webview.html = chatInterface
      .loadHTML('./views/homepage.html')
      .replace(
        'IMAGE_PATH',
        'https://narender-kheder.github.io/debugasaurus/features/chat/views/images/debugasourus.png'
      )

    panel.webview.postMessage({
      command: 'detectedApiKey',
      metadata: { detectedApiKey: llm.apiKeyLoaded() }
    })

    panel.webview.onDidReceiveMessage(async message =>{
      switch (message.command) {
        case 'switchView':
          if (message.view === 'chatInterface') {
            panel.webview.html = chatInterface
              .loadHTML('./views/chatInterface.html')
              .replace(
                'IMAGE_PATH',
                'https://narender-kheder.github.io/debugasaurus/features/chat/views/images/debugasourus.png'
              )
          }
          break
        case 'apiKeyEntry':
          console.log("here is the key"+message.key);
          await llm.uploadApiKey(message.key)
          panel.webview.postMessage({
            command: 'detectedApiKey',
            metadata: { detectedApiKey: llm.apiKeyLoaded() }
          })
      }
    })

    panel.webview.onDidReceiveMessage(
      async message => {
        if (message.command === 'sendMessage') {
          const userMessage = message.text
          const { aiResponse, metadata } = await llm.queryLLM(
            userMessage,
            editor.document
          )
          panel.webview.postMessage({
            command: 'receiveMessage',
            text: aiResponse,
            metadata: metadata
          })
        } else if (message.command === 'runGitCommand') {
          const aiGitCommand = message.aiGitCommand
          const aiResponse = await llm.runGitCommand(aiGitCommand)
          panel.webview.postMessage({
            command: 'receiveMessage',
            text: aiResponse
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
