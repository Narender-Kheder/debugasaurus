const utils = require('../../uitls')
const git = require('../git')
const aiPrompts = require('../prompts.json')

let history = ''

async function queryLLM (userMessage, document) {
  const prompts = aiPrompts.chat
  const code = document.getText()

  const userIntent = await utils.queryLLM(
    prompts.classifier +
      userMessage +
      '\n\n\n\n Here is the users code file for context:' +
      code
  )

  console.log('\n' + userIntent + '\n')

  let userPrompt = prompts.system_prompt + code

  switch (userIntent) {
    case 'CLARIFICATION':
      return await clarification(prompts, userMessage, code)
    case 'GENERATION':
      return await generation(prompts, userMessage, document)
    case 'GIT':
      return await gitCheck(prompts, userMessage)
    case 'REGULAR':
      return await clarification(prompts, userMessage, document)
    default:
      return await clarification(prompts, userMessage, document)
  }
}

async function clarification (prompts, userMessage, code) {
  let userPrompt =
    prompts.system_prompt + code + addHistory() + addUserQuestion(userMessage)

  return askLLM(userPrompt, userMessage)
}

async function generation (prompts, userMessage, document) { //expand so the ai can change the file for the user
  return clarification(prompts, userMessage, document.getText()) // to be changed
}

async function gitCheck (prompts, userMessage) { //expand so the ai can do the git stuff for the user
  let userPrompt = prompts.git_system_prompt
  try {
    userPrompt += await git.checkGitErrors()
  } catch (error) {
    console.log('git check for llm didnt work')
  }
  userPrompt += addHistory() + addUserQuestion(userMessage)

  return askLLM(userPrompt, userMessage)
}

async function askLLM (prompt, userMessage) {
  const aiResponse = await utils.queryLLM(prompt)
  updateHistory(userMessage, aiPrompts)
  return aiResponse
}

function addHistory () {
  return '\nHere is the current chat history:\n' + history
}
function updateHistory (userMessage, aiResponse) {
  history +=
    'USER MESSAGE:' + userMessage + '\n' + 'AI MESSAGE:' + aiResponse + '\n\n'
}
function addUserQuestion (userMessage) {
  return (
    '\n\n\nUse the data above to answer this users question:\n' + userMessage
  )
}

module.exports = {
  queryLLM
}
