const vscode = require('vscode')

async function checkGitErrors () {
  console.log('Lets start the git check extension')
  const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports
  if (!gitExtension) {
    vscode.window.showErrorMessage('Git extension not found')
    return
  }

  const api = gitExtension.getAPI(1)
  const repo = api.repositories[0]

  if (!repo) {
    vscode.window.showErrorMessage('No Git repository found')
    return
  }

  try {
    // Check for uncommitted changes
    const status = await repo.state.workingTreeChanges
    if (status.length > 0) {
      console.log(
        'There are uncommitted changes in your repository.'
      )
    }

    // Check for merge conflicts
    const mergeChanges = status.filter(change => change.status === 12) // 12 represents merge conflicts
    if (mergeChanges.length > 0) {
      vscode.window.showErrorMessage(
        'There are merge conflicts in your repository.'
      )
    }

     // Check for unpushed commits
     const head = repo.state.HEAD;
    if (head) {
      const refs = await repo.getRefs();
      const upstream = refs.find(ref => 
       ref.type === 2 && // 2 represents RemoteHead
        ref.name === `origin/${head.name}`
      );
      
      if (!upstream) {
        console.log('The current branch has no upstream branch.');
      } else if (head.commit !== upstream.commit) {
        console.log('There are unpushed commits in your repository.');
      }
    } else {
      console.log('Unable to determine the current HEAD.');
    }

    // You can add more checks here as needed
  } catch (error) {
    vscode.window.showErrorMessage(`Git error: ${error.message}`)
  }
}

module.exports = {
  checkGitErrors
}
