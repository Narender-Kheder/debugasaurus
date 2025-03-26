const vscode = require('vscode')
const utils = require('../../utils')
// @ts-ignore
const aiPrompts = require('../prompts.json')

async function commentCode () {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('Open a file to comment code.')
    return
  }

  let selectedCode = editor.document.getText(editor.selection)
  let startOfLinePos = new vscode.Position(editor.selection.start.line, 0)

  if (!selectedCode.trim()) {
    const userPosition = editor.selection.active
    selectedCode = editor.document.lineAt(userPosition.line).text
    if (!selectedCode) {
      vscode.window.showErrorMessage('Select some code to comment.')
      return
    }
  }

  const prompts = aiPrompts.comment

  try {
    let generatedComment = await utils.queryLLM(
      prompts.system_prompt +
        selectedCode +
        '\n\n The comment must be in: ' +
        editor.document.languageId
    )
    const completionItems = [
      {
        label: 'Insert Comment:  ',
        description: generatedComment
      },
      {
        label: 'Cancel',
        description: 'Hope to roar with you again'
      }
    ]
    vscode.window
      .showQuickPick(completionItems, {
        placeHolder: 'Select an option'
      })
      .then(selection => {
        if (!selection || selection.label == 'Cancel') return
        editor.edit(editBuilder => {
          editBuilder.insert(startOfLinePos, generatedComment + '\n')
        })
      })
  } catch (error) {
    vscode.window.showErrorMessage('Error commenting code: ' + error.message)
  }
}

const provider = vscode.commands.registerCommand(
  'debugasourus.generateComments',
  async () => {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Comment-asaurus is thinking... and possibly roaring',
        cancellable: false
      },
      () => {
        return new Promise(async resolve => {
          await commentCode()
          resolve()
        })
      }
    )
  }
)

module.exports = {
  provider
}
