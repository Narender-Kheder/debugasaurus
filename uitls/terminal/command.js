const exec = require('child_process')
const util = require('util')
const vscode = require('vscode')

const execAsync = util.promisify(exec.exec)

async function runCommand (command) {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspacePath = workspaceFolders[0].uri.fsPath

    try {
      const { stdout } = await execAsync(`cd ${workspacePath} && ${command}`)
      return stdout.trim()
    } catch (error) {
      console.log(`Execution error: ${error.message}`)
      return `Execution error: ${error.message}`
    }
  }
}

module.exports = {
  runCommand
}
