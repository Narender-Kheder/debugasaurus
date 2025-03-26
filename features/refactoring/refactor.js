const vscode = require('vscode')
const utils = require('../../utils')
// @ts-ignore
const aiPrompts = require('../prompts.json')

let deleteCodeCommand = null
let deleteReplaceCodeCommand = null
let refactorMenu = null
let refactorMenuHidden = null

async function refactorCode (context) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('Open a file to refactor code.')
    return
  }
  const selectedCode = editor.document.getText(editor.selection)
  if (!selectedCode.trim()) {
    vscode.window.showErrorMessage('Select some code to refactor.')
    return
  }
  const prompts = aiPrompts.refactor

  try {
    const response = await utils.queryLLM(prompts.system_prompt + selectedCode)
    const refactoredCode =
      response.match(/```(?:python|js|c\+\+|java)?\n([\s\S]*?)```/)?.[1] ||
      response

    let newEditor = await openCustomEditor(
      editor.document.getText(),
      editor.document.languageId,
      editor.selection,
      refactoredCode
    )
    if (deleteCodeCommand) deleteCodeCommand.dispose()
    deleteCodeCommand = vscode.commands.registerCommand(
      'debugasourus.deleteRefactoredCode',
      async () => await deleteRefactoredCode(newEditor)
    )

    if (deleteReplaceCodeCommand) deleteReplaceCodeCommand.dispose()
    deleteReplaceCodeCommand = vscode.commands.registerCommand(
      'debugasourus.applyRefactoredCode',
      async () => await applyRefactoredCode(editor, newEditor)
    )
    openStatusBarMenu(context)

    vscode.window.showInformationMessage(
      'Refactor-asourus: You can apply changes from Status Bar'
    )
  } catch (error) {
    vscode.window.showErrorMessage('Error refactoring code: ' + error.message)
  }
}

async function deleteRefactoredCode (newEditor) {
  await vscode.window.showTextDocument(
    newEditor.document,
    newEditor.viewColumn,
    false
  )
  await vscode.commands.executeCommand(
    'workbench.action.revertAndCloseActiveEditor'
  )
}
async function applyRefactoredCode (oldEditor, newEditor) {
  const newCode = newEditor.document.getText()
  const oldDoc = oldEditor.document

  const startPos = new vscode.Position(0, 0)
  const endPos = oldDoc.lineAt(oldDoc.lineCount - 1).range.end
  const fullRange = new vscode.Range(startPos, endPos)

  await oldEditor.edit(editBuilder => {
    editBuilder.replace(fullRange, newCode)
  })

  deleteRefactoredCode(newEditor)
}

async function openCustomEditor (
  content,
  languageId = 'plaintext',
  selection,
  newContent
) {
  let doc = await vscode.workspace.openTextDocument(
    vscode.Uri.parse(`untitled:Refector-asourus`)
  )
  doc = await vscode.languages.setTextDocumentLanguage(doc, languageId)
  const editor = await vscode.window.showTextDocument(doc, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside
  })

  await editor.edit(editBuilder => {
    const lastLine = doc.lineCount - 1
    editBuilder.delete(
      new vscode.Range(0, 0, lastLine, doc.lineAt(lastLine).text.length)
    )
  })

  await editor.edit(editBuilder => {
    editBuilder.insert(new vscode.Position(0, 0), content)
  })
  await editor.edit(editBuilder => {
    editBuilder.replace(selection, newContent)
  })
  return editor
}

function openStatusBarMenu (context) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  )
  refactorMenuHidden = statusBarItem
  statusBarItem.text = '$(tools) Refactor-asourus Options'
  statusBarItem.tooltip = 'Click to apply refactor'
  statusBarItem.command = 'extension.showRefactorOptions'
  statusBarItem.show()

  if (refactorMenu) refactorMenu.dispose()
  refactorMenu = vscode.commands.registerCommand(
    'extension.showRefactorOptions',
    async () => {
      const selection = await vscode.window.showQuickPick(
        ['Apply', 'Discard'],
        {
          placeHolder: 'Choose a refactor action'
        }
      )
      if (!selection) {
        return
      }
      if (selection === 'Apply') {
        vscode.window.showInformationMessage('Refactor-asourus: Apply selected')
        vscode.commands.executeCommand('debugasourus.applyRefactoredCode')
      } else if (selection === 'Discard') {
        vscode.window.showInformationMessage('Refactor-asourus: Discard selected')
        vscode.commands.executeCommand('debugasourus.deleteRefactoredCode')
      }
      statusBarItem.hide()
    }
  )

  context.subscriptions.push(statusBarItem, refactorMenu)
}

vscode.workspace.onDidCloseTextDocument((document) => {
    if (refactorMenuHidden && document.uri.toString() === 'untitled:Refector-asourus') {
      refactorMenuHidden.hide()
    }
  });

async function refactor (context) {
  return vscode.commands.registerCommand(
    'debugasourus.refactorCode',
    async () => refactorCode(context)
  )
}
module.exports = {
  refactor
}
