const path = require('path');
const vscode = require('vscode');
const utils = require('../../uitls');

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

        // Set the HTML content for the Webview
        panel.webview.html = getWebviewContent();
        
        // Analyze code when user activates the debugging feature
        vscode.workspace.onDidSaveTextDocument((document) => {
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
    })
}

// Send code to OpenAI API for analysis
async function analyzeCode(code) {
  const response = await utils.queryLLM(`Analyze the following Python code for syntax and runtime errors. Provide a list of identified issues and optional explanations for each:\n\n${code}`);
  return response.split('\n');
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
    createDebuggingPanel
};
