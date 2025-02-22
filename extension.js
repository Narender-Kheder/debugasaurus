const vscode = require('vscode')

const chat = require('./features/chat')
const git = require('./features/git')
const completions = require('./features/completion')
const utils = require('./uitls')
const aiPrompts = require('./features/prompts.json')
const refactor = require('./features/refactoring')
const optimize = require('./features/optimization')

/* async function refactorCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("Open a file to refactor code.");
        return;
    }

    const selectedCode = editor.document.getText(editor.selection);
    if (!selectedCode.trim()) {
        vscode.window.showErrorMessage("Select some code to refactor.");
        return;
    }
    const prompts = aiPrompts.refactor

    try {
        const response = await utils.queryLLM(prompts.system_prompt + selectedCode);
        const codeOnly = response.match(/```(?:python|js|c\+\+|java)?\n([\s\S]*?)```/)?.[1] || response;
        const refactoredCode = codeOnly//.replace(/\n/g, '\n    ');

        // Show the refactored code in a pop-up suggestion
        vscode.window.showQuickPick(
          [`Apply Refactored Code:\n\n${refactoredCode}`, "Cancel"], 
          { placeHolder: "Select an option" }
      ).then(selection => {
          if (selection && selection.startsWith("Apply Refactored Code")) {
              editor.edit(editBuilder => {
                  editBuilder.replace(editor.selection, refactoredCode);
              });
              vscode.window.showInformationMessage("Code refactored successfully!");
          }
      });
       // vscode.window.showInformationMessage("Code refactored successfully!");
    } catch (error) {
        vscode.window.showErrorMessage("Error refactoring code: " + error.message);
    }
} */
/* async function optimizeCode() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
      vscode.window.showErrorMessage("Open a file to optimize code.");
      return;
  }

  const selectedCode = editor.document.getText(editor.selection);
  if (!selectedCode.trim()) {
      vscode.window.showErrorMessage("Select some code to optimize.");
      return;
  }
  const prompts = aiPrompts.optimization

  try {
      const response = await utils.queryLLM(prompts.system_prompt + selectedCode);
      const codeOnly = response.match(/```(?:python|js|c\+\+|java)?\n([\s\S]*?)```/)?.[1] || response;
      const refactoredCode = codeOnly//.replace(/\n/g, '\n    ');

      // Show the refactored code in a pop-up suggestion
      vscode.window.showQuickPick(
        [`Apply optimized Code:\n\n${refactoredCode}`, "Cancel"], 
        { placeHolder: "Select an option" }
    ).then(selection => {
        if (selection && selection.startsWith("Apply optimized Code")) {
            editor.edit(editBuilder => {
                editBuilder.replace(editor.selection, refactoredCode);
            });
            vscode.window.showInformationMessage("Code optimized successfully!");
        }
    });
     // vscode.window.showInformationMessage("Code refactored successfully!");
  } catch (error) {
      vscode.window.showErrorMessage("Error optimizing code: " + error.message);
  }
} */
/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  //let disposable = vscode.commands.registerCommand("debugasourus.refactorCode", refactorCode);
  //let disposable2 = vscode.commands.registerCommand("debugasourus.optimizeCode", optimizeCode);
  console.log('Congratulations, your extension "debugasourus" is now active!')

  context.subscriptions.push(completions.provider, chat.provider(context), refactor.refactor, git.provider, optimize.optimize);
}

function deactivate() {}

module.exports = {
  activate, deactivate
}
