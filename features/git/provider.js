const vscode = require('vscode')
const gitError = require('./gitError.js')

const provider = vscode.commands.registerCommand(
  'debugasourus.checkGitErrors',
  async function () {
    await gitError.checkGitErrors()
  }
)

module.exports = {
  provider
}
