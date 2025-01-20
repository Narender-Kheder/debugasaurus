const vscode = require('vscode')
const llm = require('./llmAgent.js')

const provider = vscode.commands.registerCommand(
  'debugasourus.triggerCustomCompletion',
  async () => {
    const editor = vscode.window.activeTextEditor

    if (!editor) {
      vscode.window.showInformationMessage('No active editor found.')
      return
    }

    // Get the current cursor position and line text
    const position = editor.selection.active

    // Debugging - Log the linePrefix
    const aiSuggestion = await llm.queryLLM(
      editor.document.getText(
        new vscode.Range(new vscode.Position(0, 0), position)
      ) + '(<-- user is here)'
    )

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
      .showQuickPick(completionItems, { placeHolder: 'Choose a completion' })
      .then(selected => {
        if (!selected || selected.label == 'Cancel') return      
        editor.insertSnippet(new vscode.SnippetString(selected.description))
      })
  }
)

module.exports = {
  provider
}
