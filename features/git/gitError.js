const vscode = require('vscode')

async function checkGitErrors() {
  let resultSummary = "Git Check Summary:\n";
  
  console.log("Let's start the git check extension");
  resultSummary += "Let's start the git check extension\n";

  const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;
  if (!gitExtension) {
    vscode.window.showErrorMessage("Git extension not found");
    resultSummary += "Error: Git extension not found\n";
    return resultSummary;
  }

  const api = gitExtension.getAPI(1);
  const repo = api.repositories[0];

  if (!repo) {
    vscode.window.showErrorMessage("No Git repository found");
    resultSummary += "Error: No Git repository found\n";
    return resultSummary;
  }

  try {
    // Check for uncommitted changes
    const status = await repo.state.workingTreeChanges;
    if (status.length > 0) {
      const message = "There are uncommitted changes in your repository.";
      console.log(message);
      resultSummary += message + "\n";
    } else {
      resultSummary += "No uncommitted changes found.\n";
    }

    // Check for merge conflicts
    const mergeChanges = status.filter((change) => change.status === 12); // 12 represents merge conflicts
    if (mergeChanges.length > 0) {
      const message = "There are merge conflicts in your repository.";
      vscode.window.showErrorMessage(message);
      resultSummary += message + "\n";
    } else {
      resultSummary += "No merge conflicts found.\n";
    }

    // Check for unpushed commits
    const head = repo.state.HEAD;
    if (head) {
      const refs = await repo.getRefs();
      const upstream = refs.find(
        (ref) =>
          ref.type === 2 && // 2 represents RemoteHead
          ref.name === `origin/${head.name}`
      );

      if (!upstream) {
        const message = "The current branch has no upstream branch.";
        console.log(message);
        resultSummary += message + "\n";
      } else if (head.commit !== upstream.commit) {
        const message = "There are unpushed commits in your repository.";
        console.log(message);
        resultSummary += message + "\n";
      } else {
        resultSummary += "No unpushed commits found.\n";
      }
    } else {
      const message = "Unable to determine the current HEAD.";
      console.log(message);
      resultSummary += message + "\n";
    }
  } catch (error) {
    const errorMessage = `Git error: ${error.message}`;
    vscode.window.showErrorMessage(errorMessage);
    resultSummary += errorMessage + "\n";
  }

  return resultSummary;
}


module.exports = {
  checkGitErrors
}
