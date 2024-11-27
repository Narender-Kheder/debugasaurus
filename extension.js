const vscode = require('vscode')

const chat = require('./features/chat')
const git = require('./features/git')
const completions = require('./features/completion')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  console.log('Congratulations, your extension "debugasourus" is now active!')

  context.subscriptions.push(completions.provider, chat.provider(context), git.provider)
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
}
