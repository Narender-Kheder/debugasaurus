const vscode = require('vscode')
const chat = require('./features/chat')
const completions = require('./features/completion')
const refactor = require('./features/refactoring')
const optimizer = require('./features/optimization')
const commenter = require('./features/comment')
const debug = require('./features/debug')
/**
 * @param {vscode.ExtensionContext} context
 */
async function activate (context) {
  const treeDataProvider = new DebugasourusProvider()
  vscode.window.registerTreeDataProvider('debugasourusTree', treeDataProvider)
  console.log('Congratulations, your extension "debugasourus" is now active!')
  context.subscriptions.push(
    await chat.provider(context),
    completions.provider,
    await refactor.refactor(context),
    await optimizer.optimize(context),
    commenter.provider,
    debug.provider
  )
}

// Tree View Implementation
class DebugasourusProvider {
  getTreeItem (element) {
    return element
  }

  getChildren () {
    return [
      new DebugasourusItem('Start Chat', 'debugasourus.startChat'),
      new DebugasourusItem(
        'Complete Code',
        'debugasourus.triggerCustomCompletion'
      ),
      new DebugasourusItem(
        'Generate Comments',
        'debugasourus.generateComments'
      ),
      new DebugasourusItem('Refactor Code', 'debugasourus.refactorCode'),
      new DebugasourusItem('Optimize Code', 'debugasourus.optimizeCode'),
      new DebugasourusItem('Code Review', 'debugasourus.debugCode')
    ]
  }
}

class DebugasourusItem extends vscode.TreeItem {
  constructor (label, command) {
    super(label, vscode.TreeItemCollapsibleState.None)
    this.command = { command, title: label }
  }
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
}
