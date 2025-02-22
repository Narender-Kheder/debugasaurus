const vscode = require('vscode')
const utils = require('../../uitls')
const aiPrompts = require('../prompts.json')

async function optimizeCode() {
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
}

const optimize = vscode.commands.registerCommand("debugasourus.optimizeCode", optimizeCode);

module.exports = {
    optimize
  }