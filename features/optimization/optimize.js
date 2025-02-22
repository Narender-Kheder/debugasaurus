const vscode = require('vscode');
const utils = require('../../uitls');
const aiPrompts = require('../prompts.json');

// Function to optimize code
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
    const prompts = aiPrompts.optimization;

    try {
        const response = await utils.queryLLM(prompts.system_prompt + selectedCode);
        const optimizedCode = response.match(/```(?:python|js|c\+\+|java)?\n([\s\S]*?)```/)?.[1] || response;

        // Create the optimization comment
        const optimizeComment = `\n// 🔧 Suggested Optimization:\n// ${optimizedCode.split("\n").join("\n// ")}\n// 🟢 Click 'Apply Optimization' below`;

        // Insert the optimization comment in the editor
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.end, optimizeComment);
        });

        vscode.window.showInformationMessage("Optimized code added as a suggestion. Click 'Apply Optimization' to use it.");

    } catch (error) {
        vscode.window.showErrorMessage("Error optimizing code: " + error.message);
    }
}

// Function to delete suggested optimization
async function deleteOptimizedCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("Open a file to delete optimized code.");
        return;
    }

    const document = editor.document;
    const text = document.getText();
    const match = text.match(/\/\/ 🔧 Suggested Optimization:[\s\S]*?\/\/ 🟢/);

    if (match) {
        const startLine = document.positionAt(match.index).line;
        const endLine = document.positionAt(match.index + match[0].length).line;

        // Delete the matched optimization comments
        editor.edit(editBuilder => {
            editBuilder.delete(new vscode.Range(startLine, 0, endLine + 1, 0)); // +1 to include the line with // 🟢
        });

        vscode.window.showInformationMessage("Suggested optimization deleted successfully!");
    } else {
        vscode.window.showErrorMessage("No suggested optimization found to delete.");
    }
}

// Function to apply optimized code
function applyOptimizedCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const text = document.getText();
    const match = text.match(/\/\/ 🔧 Suggested Optimization:\s*([\s\S]*?)\s*\/\/ 🟢/);

    if (match) {
        const optimizedCode = match[1]
            .split("\n")
            .map(line => line.replace(/^\/\/\s?/, "")) // Remove comment markers
            .join("\n");

        editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, optimizedCode);
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage("Optimized code applied successfully!");
            } else {
                vscode.window.showErrorMessage("Failed to apply optimized code.");
            }
        });
    } else {
        vscode.window.showErrorMessage("No optimized code found.");
    }
}

// CodeLens provider for suggested optimizations
class OptimizeCodeLensProvider {
    provideCodeLenses(document, token) {
        const lenses = [];
        const text = document.getText();

        if (text.includes("// 🔧 Suggested Optimization:")) {
            const line = text.indexOf("// 🔧 Suggested Optimization:");
            const position = document.positionAt(line);
            lenses.push(new vscode.CodeLens(new vscode.Range(position.line, 0, position.line, 0), {
                title: "🛠️ Apply Optimization",
                command: "debugasourus.applyOptimizedCode"
            }));
            lenses.push(new vscode.CodeLens(new vscode.Range(position.line + 1, 0, position.line + 1, 0), {
                title: "❌ Delete Optimization",
                command: "debugasourus.deleteOptimizedCode"
            }));
        }

        return lenses;
    }
}

// Register commands and providers
const optimize = vscode.commands.registerCommand("debugasourus.optimizeCode", optimizeCode);
const applyOptimize = vscode.commands.registerCommand("debugasourus.applyOptimizedCode", applyOptimizedCode);
const deleteOptimize = vscode.commands.registerCommand("debugasourus.deleteOptimizedCode", deleteOptimizedCode);
const optimizeCodeLensProvider = vscode.languages.registerCodeLensProvider("*", new OptimizeCodeLensProvider());

module.exports = {
    optimize,
    applyOptimize,
    deleteOptimize,
    optimizeCodeLensProvider
};