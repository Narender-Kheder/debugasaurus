const vscode = require('vscode')
const utils = require('../../uitls')
const aiPrompts = require('../prompts.json')

async function refactorCode() {
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
}
const refactor = vscode.commands.registerCommand("debugasourus.refactorCode", refactorCode);

module.exports = {
    refactor
  }