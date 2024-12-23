const axios = require('axios');

async function queryLLM (userMessage) {
  try {
    const apiKey =
      '' // Replace with your API key or else it won't work
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

module.exports = {
  queryLLM
}