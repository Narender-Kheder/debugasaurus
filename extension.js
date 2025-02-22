const vscode = require('vscode')

const chat = require('./features/chat')
const git = require('./features/git')
const completions = require('./features/completion')
const refactor = require('./features/refactoring')
const optimizer = require('./features/optimization')
const commentor = require('./features/comment')
/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  //let disposable = vscode.commands.registerCommand("debugasourus.refactorCode", refactorCode);
  //let disposable2 = vscode.commands.registerCommand("debugasourus.optimizeCode", optimizeCode);
  console.log('Congratulations, your extension "debugasourus" is now active!')

  context.subscriptions.push(completions.provider, chat.provider(context), refactor.refactor, git.provider, optimizer.optimize, commentor.commentor);
}

function deactivate() {}

module.exports = {
  activate, deactivate
}
