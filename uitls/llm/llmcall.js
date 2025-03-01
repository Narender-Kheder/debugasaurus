const axios = require('axios')
const terminal = require('../terminal')

let apiKey = ''

async function queryLLM (userMessage) {
  if (!apiKey) return `Error: DEBUGASAURUS_OPENAI_API_KEY is not found.`
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: userMessage }]
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )
    return response.data.choices[0].message.content.trim()
  } catch (error) {
    return `Error: ${error.message}`
  }
}

async function apiKeyCheck () {
  const check = await queryLLM(
    "your job is to return the word 'yes'. Return only the word 'yes', nothing else."
  )
  if (check !== 'yes') apiKey = ''
  console.log('this is the check ' + check)
}

async function loadApiKey () {
  apiKey = await terminal.runCommand(
    'source ~/.zshrc && echo $DEBUGASAURUS_OPENAI_API_KEY'
  )
  if (apiKey) await apiKeyCheck()
}

async function uploadApiKey (key) {
  apiKey = key
  await apiKeyCheck()
  if (apiKeyLoaded())
    terminal.runCommand(
      `print '\nexport DEBUGASAURUS_OPENAI_API_KEY="${key}"\' >> ~/.zshrc && source ~/.zshrc`
    )
}

function apiKeyLoaded () {
  return !!apiKey
}

module.exports = {
  queryLLM,
  loadApiKey,
  apiKeyLoaded,
  uploadApiKey
}
