const vscode = require('vscode')
const utils = require('../../utils')

const provider = vscode.commands.registerCommand(
  'debugasourus.debugCode',
  async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      vscode.window.showInformationMessage('No active editor found.')
      return
    }
    const document = editor.document

    const panel = vscode.window.createWebviewPanel(
      'debuggingSuggestions',
      'Coding Suggestions',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true
      }
    )
    panel.webview.html = utils
      .loadHTML('./features/debug/view.html')
      .replace(
        'IMAGE_PATH',
        'https://narender-kheder.github.io/debugasaurus/features/chat/views/images/debugasourus.png'
      )

    await analyzeCodeWithPost(document, panel)

    // Analyze code when user activates the debugging feature
    vscode.workspace.onDidSaveTextDocument(
      async document => await analyzeCodeWithPost(document, panel)
    )
  }
)

async function analyzeCodeWithPost (document, panel) {
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Code Review-saurus is thinking... and possibly roaring',
      cancellable: false
    },
    () => {
      return new Promise(async resolve => {
        await analyzeCode(document.getText())
          .then(suggestions => {
            panel.webview.postMessage({ suggestions })
          })
          .catch(error => {
            console.error(error)
          })
        resolve()
      })
    }
  )
}

async function analyzeCode (code) {
  console.log('analyze code started')
  const response = await utils.queryLLM(
    `Analyze the following code for syntax and runtime errors. Provide a list of identified issues and optional explanations for each:\n\n${code}`
  )
  return response.split('\n')
}

module.exports = {
  provider
}
