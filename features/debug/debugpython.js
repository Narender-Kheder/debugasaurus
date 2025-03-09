// Description: This file contains the code to create a debugging panel for Python code in the extension.
// The debugging panel will display suggestions for debugging Python code based on the analysis of the code.

const path = require('path');
const vscode = require('vscode');
const utils = require('../../uitls');

// Send code to OpenAI API for analysis
async function analyzeCode(code) {
    const response = await utils.queryLLM(`Analyze the following Python code for syntax and runtime errors. Provide a list of identified issues and optional explanations for each:\n\n${code}`);
    //console.log("OpenAI API Response:", JSON.stringify(response.data, null, 2)); // ✅ Debugging Output
    return response.split('\n');
  }
// Create a new Webview Panel to display the debugging suggestions
function createDebuggingPanel(context) {
    return vscode.commands.registerCommand('debugasourus.debugCode', () => {
        const panel = vscode.window.createWebviewPanel(
            'debuggingSuggestions', // Identifies the type of the webview
            'Debugging Suggestions', // Title of the panel
            vscode.ViewColumn.Beside, // View location
            {
            enableScripts: true,
            }
        );
        console.log("Debugging Panel Created"); // ✅ Debugging Output
        // Set the HTML content for the Webview
        panel.webview.html = getWebviewContent();
        
        // Analyze code when user activates the debugging feature
        vscode.workspace.onDidSaveTextDocument(async (document) => {
            if (document.languageId === 'python') {
                analyzeCode(document.getText())
                .then(suggestions => {
                panel.webview.postMessage({ suggestions });
                })
                .catch(error => {
                console.error(error);
                });
            }
        });
    });
}


// Webview HTML content for showing suggestions
function getWebviewContent() {
  return `
  <html>
    <body>
      <h2>Debugging Suggestions</h2>
      <div id="suggestions"></div>
      <script>
        const vscode = acquireVsCodeApi();
        
        window.addEventListener('message', event => {
          const suggestions = event.data.suggestions;
          const suggestionsDiv = document.getElementById('suggestions');
          
          // Clear previous suggestions
          suggestionsDiv.innerHTML = "";

          suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.textContent = suggestion;
            suggestionsDiv.appendChild(suggestionElement);
          });
        });
      </script>
    </body>
  </html>
`;
}

module.exports = {
    createDebuggingPanel,
    analyzeCode,
    getWebviewContent
};
