const vscode = require('vscode')
const utils = require('../../utils')
// @ts-ignore
const aiPrompts = require('../prompts.json')

let deleteCodeCommand = null
let deleteReplaceCodeCommand = null
let optimizeMenu = null
let optimizeMenuHidden = null

async function optimizeCode (context) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('Open a file to optimize code.')
    return
  }
  const selectedCode = editor.document.getText(editor.selection)
  if (!selectedCode.trim()) {
    vscode.window.showErrorMessage('Select some code to optimize.')
    return
  }
  const prompts = aiPrompts.optimization

  try {
    const response = await utils.queryLLM(prompts.system_prompt + selectedCode)
    const optimizedCode =
      response.match(/```(?:python|js|c\+\+|java)?\n([\s\S]*?)```/)?.[1] ||
      response

    let newEditor = await openCustomEditor(
      editor.document.getText(),
      editor.document.languageId,
      editor.selection,
      optimizedCode
    )
    if (deleteCodeCommand) deleteCodeCommand.dispose()
    deleteCodeCommand = vscode.commands.registerCommand(
      'debugasourus.deleteOptimizedCode',
      async () => await deleteOptimizedCode(newEditor)
    )

    if (deleteReplaceCodeCommand) deleteReplaceCodeCommand.dispose()
    deleteReplaceCodeCommand = vscode.commands.registerCommand(
      'debugasourus.applyOptimizedCode',
      async () => await applyOptimizedCode(editor, newEditor)
    )
    openStatusBarMenu(context)

    vscode.window.showInformationMessage(
      'optimize-asourus: You can apply changes from Status Bar'
    )
  } catch (error) {
    vscode.window.showErrorMessage('Error optimizing code: ' + error.message)
  }
}

async function deleteOptimizedCode (newEditor) {
  await vscode.window.showTextDocument(
    newEditor.document,
    newEditor.viewColumn,
    false
  )
  await vscode.commands.executeCommand(
    'workbench.action.revertAndCloseActiveEditor'
  )
}
async function applyOptimizedCode (oldEditor, newEditor) {
  const newCode = newEditor.document.getText()
  const oldDoc = oldEditor.document

  const startPos = new vscode.Position(0, 0)
  const endPos = oldDoc.lineAt(oldDoc.lineCount - 1).range.end
  const fullRange = new vscode.Range(startPos, endPos)

  await oldEditor.edit(editBuilder => {
    editBuilder.replace(fullRange, newCode)
  })

  deleteOptimizedCode(newEditor)
}

async function openCustomEditor (
  content,
  languageId = 'plaintext',
  selection,
  newContent
) {
  let doc = await vscode.workspace.openTextDocument(
    vscode.Uri.parse(`untitled:Optimize-asourus`)
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
  optimizeMenuHidden = statusBarItem
  statusBarItem.text = '$(tools) Optimize-asourus Options'
  statusBarItem.tooltip = 'Click to apply optimize'
  statusBarItem.command = 'extension.showOptimizeOptions'
  statusBarItem.show()

  if (optimizeMenu) optimizeMenu.dispose()
  optimizeMenu = vscode.commands.registerCommand(
    'extension.showOptimizeOptions',
    async () => {
      const selection = await vscode.window.showQuickPick(
        ['Apply', 'Discard'],
        {
          placeHolder: 'Choose a optimize action'
        }
      )
      if (!selection) {
        return
      }
      if (selection === 'Apply') {
        vscode.window.showInformationMessage('Optimize-asourus: Apply selected')
        vscode.commands.executeCommand('debugasourus.applyOptimizedCode')
      } else if (selection === 'Discard') {
        vscode.window.showInformationMessage('Optimize-asourus: Discard selected')
        vscode.commands.executeCommand('debugasourus.deleteOptimizedCode')
      }
      statusBarItem.hide()
    }
  )

  context.subscriptions.push(statusBarItem, optimizeMenu)
}

vscode.workspace.onDidCloseTextDocument((document) => {
    if (optimizeMenuHidden && document.uri.toString() === 'untitled:Optimize-asourus') {
      optimizeMenuHidden.hide()
    }
  });

async function optimize (context) {
  return vscode.commands.registerCommand(
    'debugasourus.optimizeCode',
    async () => optimizeCode(context)
  )
}
module.exports = {
  optimize
}