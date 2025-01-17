const vscode = require('vscode')
const gitError = require('./gitError.js')

const provider = vscode.commands.registerCommand(
  'debugasourus.checkGitErrors',
  async function () {
    console.log("\n\n\n")
    console.log(await gitError.checkGitErrors())
  }
)

module.exports = {
  provider
}
