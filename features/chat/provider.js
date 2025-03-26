const path = require('path')
const vscode = require('vscode')
const llm = require('./llmAgent.js')
const utils = require('../../utils')

async function provider (context) {

  await llm.loadApiKey(context)
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
    panel.webview.html = utils
      .loadHTML('./features/chat/views/homepage.html')
      .replace(
        'IMAGE_PATH',
        'https://narender-kheder.github.io/debugasaurus/features/chat/views/images/debugasourus.png'
      )
    let previous = panel.webview.html

    postApiKey(panel)

    panel.webview.onDidReceiveMessage(async message => {
      if (message.command === 'switchView') {
        if (message.view === 'chatInterface') {
          panel.webview.html = utils
            .loadHTML('./features/chat/views/chatInterface.html')
            .replace(
              'IMAGE_PATH',
              'https://narender-kheder.github.io/debugasaurus/features/chat/views/images/debugasourus.png'
            )
        }
        if (message.view === 'settings') {
          previous = panel.webview.html
          panel.webview.html = utils
            .loadHTML('./features/chat/views/settings.html')
            .replace(
              'IMAGE_PATH',
              'https://narender-kheder.github.io/debugasaurus/features/chat/views/images/debugasourus.png'
            )
          postApiKey(panel)
          await postModelOptions(panel)
        }
        if (message.view === 'previous') {
          panel.webview.html = previous
        }
      }
    })

    panel.webview.onDidReceiveMessage(async message => {
      if (message.command === 'apiKeyEntry') {
        await llm.uploadApiKey(context, message.key)
        await postApiKey(panel)
        await postModelOptions(panel)
      }
      if (message.command === 'setModel') {
        await llm.uploadModelChoice(context, message.model)
        await postApiKey(panel)
        await postModelOptions(panel)
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

function postApiKey (panel) {
  panel.webview.postMessage({
    command: 'detectedApiKey',
    metadata: { detectedApiKey: llm.apiKeyLoaded() }
  })
}
async function postModelOptions (panel) {
  panel.webview.postMessage({
    command: 'modelOptions',
    metadata: { running: llm.modelRunning() , options: await llm.loadModelOptions() }
  })
}

module.exports = {
  provider
}
