const vscode = require('vscode')
const utils = require('../../uitls')
const aiPrompts = require('../prompts.json')

async function commentCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("Open a file to comment code.");
        return;
    }

    const selectedCode = editor.document.getText(editor.selection);
    if (!selectedCode.trim()) {
        vscode.window.showErrorMessage("Select some code to comment.");
        return;
    }
    const prompts = aiPrompts.comment

    try {
        let generatedComment = await utils.queryLLM(prompts.system_prompt + selectedCode);
        //const codeOnly = response.match(/```(?:python|js|c\+\+|java)?\n([\s\S]*?)```/)?.[1] || response;
        //const refactoredCode = codeOnly//.replace(/\n/g, '\n    ');
        // Ensure comment format based on language
        const languageId = editor.document.languageId;
        if (["python", "ruby"].includes(languageId)) {
            generatedComment = `# ${generatedComment}`;
        } else if (["javascript", "typescript", "java", "c", "cpp", "csharp"].includes(languageId)) {
            generatedComment = `// ${generatedComment}`;
        } else {
            generatedComment = `/* ${generatedComment} */`;
        }

        // Show the generated comment in a pop-up suggestion
        vscode.window.showQuickPick(
            [`Insert Comment:\n${generatedComment}`, "Cancel"], 
            { placeHolder: "Select an option" }
        ).then(selection => {
            if (selection && selection.startsWith("Insert Comment")) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.start, generatedComment + "\n");
                });
                vscode.window.showInformationMessage("Comment added successfully!");
            }
        });
    } catch (error) {
        vscode.window.showErrorMessage("Error commenting code: " + error.message);
    }
}
const commentor = vscode.commands.registerCommand("debugasourus.generateComments", commentCode);

module.exports = {
    commentor
  }