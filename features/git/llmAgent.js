const utils = require('../../utils')

async function gitAgent (prompts, userMessage, history) {
  const gitContext = await checkGitErrors()
  const userIntent = await getUserIntent(
    prompts,
    userMessage,
    gitContext,
    history
  )
  console.log('Users GIT intent:' + userIntent)

  if (userIntent === 'GENERATION') {
    const { aiResponse, aiGitCommand } = await generation(
      prompts,
      userMessage,
      gitContext,
      history
    )
    return { aiResponse, aiGitCommand }
  } else {
    const aiResponse = await clarification(
      prompts,
      userMessage,
      gitContext,
      history
    )
    return { aiResponse, undefined }
  }
}

async function generation (prompts, userMessage, gitContext, history) {
  const commandGenerationPrompt =
    prompts.generation_extractor +
    gitContext +
    addHistory(history) +
    addUserQuestion(userMessage)+"\nThe git command is:"

  const aiGitCommand = await utils.queryLLM(commandGenerationPrompt)
  const commandExplanationPrompt =
    prompts.generation_system_prompt +
    gitContext +
    addHistory(history) +
    addUserQuestion(userMessage)

  const aiResponse = await utils.queryLLM(commandExplanationPrompt)

  return { aiResponse, aiGitCommand }
}

async function clarification (prompts, userMessage, gitContext, history) {
  let userPrompt =
    prompts.system_prompt +
    gitContext +
    addHistory(history) +
    addUserQuestion(userMessage)
  return await utils.queryLLM(userPrompt)
}

async function getUserIntent (prompts, userMessage, gitContext, history) {
  return await utils.queryLLM(
    prompts.classifier +
      '\nUser prompt:' +
      userMessage +
      gitContext +
      '\n\nHere is the conversation history:\n' +
      history
  )
}
function addHistory (history) {
  return '\nHere is the current chat history:\n' + history
}
function addUserQuestion (userMessage) {
  return (
    '\n\n\nUse the data above to answer this users question:\n' + userMessage
  )
}
async function checkGitErrors () {
  let resultSummary = 'Users git Git Summary:\n'
  return await gitCheckFromTerminal(resultSummary)
}
async function gitCheckFromTerminal (resultSummary) {
  resultSummary += await utils.runCommand(
    'git status && git log --summary && git branch -v && git remote show origin && git diff && git ls-files && git config --list && git stash list && git reflog && git tag'
  )
  return resultSummary
}
module.exports = {
  gitAgent,
  checkGitErrors
}
