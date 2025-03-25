const utils = require('../../utils')

async function runGitCommand (prompts, aiGitCommand) {
  const commandResults = await utils.runCommand(aiGitCommand)
  console.log('Here are the command results:' + commandResults)

  const userPrompt =
    prompts.command_ran_system_prompt +
    '\nThis was the command:' +
    aiGitCommand +
    '\n\nHere are the results of the run:\n' +
    commandResults

  return await utils.queryLLM(userPrompt)
}

module.exports = {
  runGitCommand
}
