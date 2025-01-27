const vscode = require('vscode')
const llm = require('./llmAgent.js')

const provider = vscode.commands.registerCommand(
  'debugasourus.triggerCustomCompletion',
  async () => {
    const editor = vscode.window.activeTextEditor
    console.log('The generation command has been triggered')

    if (!editor) {
      vscode.window.showInformationMessage('No active editor found.')
      return
    }

    const { codeBeforeUser, userLine, codeAfterUser } =
      getUserCodeContext(editor)

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Debugasaurus is thinking... and possibly roaring',
        cancellable: false
      },
      () => {
        return new Promise(async resolve => {
          const aiSuggestion = await llm.completionGeneration({
            codeBeforeUser,
            userLine,
            codeAfterUser
          })

          showCodeOptions(editor, aiSuggestion)
          resolve()
        })
      }
    )
  }
)
function getUserCodeContext (editor) {
  const startPosition = new vscode.Position(0, 0)
  const userPosition = editor.selection.active
  const userLine = editor.document.lineAt(userPosition.line).text
  const endPosition = editor.document.lineAt(editor.document.lineCount - 1)
    .range.end
  const codeBeforeUser = editor.document.getText(
    new vscode.Range(startPosition, userPosition)
  )
  const codeAfterUser = editor.document.getText(
    new vscode.Range(userPosition, endPosition)
  )
  return {
    codeBeforeUser,
    userLine,
    codeAfterUser
  }
}

function showCodeOptions (editor, aiSuggestion) {
  const completionItems = [
    {
      label: 'Debugasourus suggestion:  ',
      description: aiSuggestion
    },
    {
      label: 'Cancel',
      description: 'The ultimate completion'
    }
  ]

  vscode.window
    .showQuickPick(completionItems, {
      placeHolder: 'Choose a completion'
    })
    .then(selected => {
      if (!selected || selected.label == 'Cancel') return
      editor.insertSnippet(
        new vscode.SnippetString('\n' + selected.description)
      )
    })
}

module.exports = {
  provider
}
