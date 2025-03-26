const vscode = require('vscode');
const utils = require('../../utils');
const aiPrompts = require('../prompts.json');

// Function to refactor code
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
    const prompts = aiPrompts.refactor;

    try {
        const response = await utils.queryLLM(prompts.system_prompt + selectedCode);
        const refactoredCode = response.match(/```(?:python|js|c\+\+|java)?\n([\s\S]*?)```/)?.[1] || response;

        // Create the refactor comment
        const refactorComment = `\n// 🔧 Suggested Refactor:\n// ${refactoredCode.split("\n").join("\n// ")}\n// 🟢`;

        // Insert the refactor comment in the editor
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.end, refactorComment);
        });

        vscode.window.showInformationMessage("Refactored code added as a suggestion. Click 'Apply Refactor' to use it.");

    } catch (error) {
        vscode.window.showErrorMessage("Error refactoring code: " + error.message);
    }
}

// Function to delete suggested refactor
async function deleteRefactoredCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("Open a file to delete refactored code.");
        return;
    }

    const document = editor.document;
    const text = document.getText();
    const match = text.match(/\/\/ 🔧 Suggested Refactor:[\s\S]*?\/\/ 🟢/);

    if (match) {
        const startLine = document.positionAt(match.index).line;
        const endLine = document.positionAt(match.index + match[0].length).line;

        // Delete the matched refactor comments
        editor.edit(editBuilder => {
            editBuilder.delete(new vscode.Range(startLine, 0, endLine + 1, 0)); // +1 to include the line with // 🟢
        });

        vscode.window.showInformationMessage("Suggested refactor deleted successfully!");
    } else {
        vscode.window.showErrorMessage("No suggested refactor found to delete.");
    }
}

// Function to apply refactored code
function applyRefactoredCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const text = document.getText();
    const match = text.match(/\/\/ 🔧 Suggested Refactor:\s*([\s\S]*?)\s*\/\/ 🟢/);

    if (match) {
        const refactoredCode = match[1]
            .split("\n")
            .map(line => line.replace(/^\/\/\s?/, "")) // Remove comment markers
            .join("\n");

        editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, refactoredCode);
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage("Refactored code applied successfully!");
            } else {
                vscode.window.showErrorMessage("Failed to apply refactored code.");
            }
        });
    } else {
        vscode.window.showErrorMessage("No refactored code found.");
    }
}

// CodeLens provider for suggested refactors
class RefactorCodeLensProvider {
    provideCodeLenses(document, token) {
        const lenses = [];
        const text = document.getText();

        if (text.includes("// 🔧 Suggested Refactor:")) {
            const line = text.indexOf("// 🔧 Suggested Refactor:");
            const position = document.positionAt(line);
            lenses.push(new vscode.CodeLens(new vscode.Range(position.line, 0, position.line, 0), {
                title: "🛠️ Apply Refactor",
                command: "debugasourus.applyRefactoredCode"
            }));
            lenses.push(new vscode.CodeLens(new vscode.Range(position.line + 1, 0, position.line + 1, 0), {
                title: "❌ Delete Refactor",
                command: "debugasourus.deleteRefactoredCode"
            }));
        }

        return lenses;
    }
}

// Register commands and providers
const refactor = vscode.commands.registerCommand("debugasourus.refactorCode", refactorCode);
const applyRefactor = vscode.commands.registerCommand("debugasourus.applyRefactoredCode", applyRefactoredCode);
const deleteRefactor = vscode.commands.registerCommand("debugasourus.deleteRefactoredCode", deleteRefactoredCode);
const refactorCodeLensProvider = vscode.languages.registerCodeLensProvider("*", new RefactorCodeLensProvider());

module.exports = {
    refactor,
    applyRefactor,
    deleteRefactor,
    refactorCodeLensProvider
};
