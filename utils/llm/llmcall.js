const axios = require('axios')
const secrets = require('../secrets')

let apiKey = ''
let model = 'gpt-4'

async function queryLLM (userMessage) {
  if (!apiKey) return `Error: DEBUGASAURUS_OPENAI_API_KEY is not found.`
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages: [{ role: 'user', content: userMessage }]
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )
    return response.data.choices[0].message.content.trim()
  } catch (error) {
    return `Error: ${error.message}`
  }
}

async function testQueryFailure () {
  return (
    (await queryLLM(
      "your job is to return the word 'yes'. Return only the word 'yes', nothing else."
    )) !== 'yes'
  )
}

async function apiKeyCheck () {
  if (await testQueryFailure()) apiKey = ''
}

async function modelCheck () {
  if (await testQueryFailure()) model = ''
}

async function loadApiKey (context) {
  apiKey = await secrets.getSecret(context, 'DEBUGASAURUS_OPENAI_API_KEY')
  model = await secrets.getSecret(context, 'DEBUGASAURUS_OPENAI_MODEL')
  if (apiKey) await apiKeyCheck()
}

async function uploadApiKey (context, key) {
  apiKey = key
  await apiKeyCheck()
  if (apiKeyLoaded())
    secrets.storeSecret(context, 'DEBUGASAURUS_OPENAI_API_KEY', key)
}

async function uploadModelChoice (context, modelChoice) {
  model = modelChoice
  await modelCheck()
  if (model != '')
    secrets.storeSecret(context, 'DEBUGASAURUS_OPENAI_MODEL', model)
}

function apiKeyLoaded () {
  return !!apiKey && !!model
}

function modelRunning () {
  return model
}

async function fetchOpenAIModels () {
  try {
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    return response.data.data.map(model => model.id)
  } catch (error) {
    return []
  }
}

module.exports = {
  queryLLM,
  loadApiKey,
  apiKeyLoaded,
  uploadApiKey,
  fetchOpenAIModels,
  modelRunning,
  uploadModelChoice
}
