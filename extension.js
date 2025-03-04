const vscode = require('vscode')

const chat = require('./features/chat')
const git = require('./features/git')
const completions = require('./features/completion')
const refactor = require('./features/refactoring')
const optimizer = require('./features/optimization')
const commentor = require('./features/comment')
const debug = require('./features/debug')
/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  const treeDataProvider = new DebugasourusProvider();
  vscode.window.registerTreeDataProvider("debugasourusTree", treeDataProvider);
  //let disposable = vscode.commands.registerCommand("debugasourus.refactorCode", refactorCode);
  //let disposable2 = vscode.commands.registerCommand("debugasourus.optimizeCode", optimizeCode);
  console.log('Congratulations, your extension "debugasourus" is now active!')

  context.subscriptions.push(completions.provider, chat.provider(context),refactor.refactor, git.provider, optimizer.optimize, commentor.commentor, debug.createDebuggingPanel(context));
}

// Tree View Implementation
class DebugasourusProvider {
  getTreeItem(element) {
    return element;
  }

  getChildren() {
    return [
      new DebugasourusItem("Check Git Errors", "debugasourus.checkGitErrors"),
      new DebugasourusItem("Start Chat", "debugasourus.startChat"),
      new DebugasourusItem("Complete Code", "debugasourus.triggerCustomCompletion"),
      new DebugasourusItem("Generate Comments", "debugasourus.generateComments"),
      new DebugasourusItem("Refactor Code", "debugasourus.refactorCode"),
      new DebugasourusItem("Optimize Code", "debugasourus.optimizeCode"),
      new DebugasourusItem("Debug Code", "debugasourus.debugCode")
    ];
  }
}

class DebugasourusItem extends vscode.TreeItem {
  constructor(label, command) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = { command, title: label };
  }
}

function deactivate() {}

module.exports = {
  activate, deactivate
}
