const utils = require('../../uitls')
const git = require('../git')
// @ts-ignore
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

  console.log('userIntent: ' + userIntent)

  switch (userIntent) {
    case 'CLARIFICATION':
      return await clarification(prompts, userMessage, code)
    case 'GENERATION':
      return await generation(prompts, userMessage, document)
    case 'GIT':
      const { aiResponse, aiGitCommand } = await git.gitAgent(
        aiPrompts.git,
        userMessage,
        history
      )
      const metadata = { aiGitCommand: aiGitCommand }
      console.log('The ai git command is:' + aiGitCommand + '.')
      updateHistory({ userMessage, aiResponse })
      return { aiResponse, metadata }
    case 'REGULAR':
      return await clarification(prompts, userMessage, document)
    default:
      return await clarification(prompts, userMessage, document)
  }
}

async function clarification (prompts, userMessage, code) {
  let userPrompt =
    prompts.system_prompt + code + addHistory() + addUserQuestion(userMessage)
  const aiResponse = await askLLM(userPrompt, userMessage)
  return { aiResponse, undefined }
}

async function generation (prompts, userMessage, document) {
  //expand so the ai can change the file for the user
  return clarification(prompts, userMessage, document.getText()) // to be changed
}

async function runGitCommand (aiGitCommand) {
  return await git.runGitCommand(aiPrompts.git, aiGitCommand)
}

async function askLLM (prompt, userMessage) {
  const aiResponse = await utils.queryLLM(prompt)
  updateHistory({ userMessage, aiResponse })
  return aiResponse
}

function addHistory () {
  return '\nHere is the current chat history:\n' + history
}
function updateHistory ({ userMessage, aiResponse }) {
  history +=
    'USER MESSAGE:' + userMessage + '\n' + 'AI MESSAGE:' + aiResponse + '\n\n'
  return aiResponse
}
function addUserQuestion (userMessage) {
  return (
    '\n\n\nUse the data above to answer this users question:\n' + userMessage
  )
}

module.exports = {
  queryLLM,
  runGitCommand
}
