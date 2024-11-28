const utils = require('../../uitls')

async function queryLLM (userMessage, document) { 

    const systemMessage = "You are a coding companion. You are given code, and your job is to answer the user based on the code. DO NOT answer with any topic other then code or programming.\n Here is the code input:\n"
    
    const code = document.getText()
    const userPrompt = systemMessage + code + "\n\nUse the code to answer this users question:\n"+ userMessage

    console.log(userPrompt)
    
    return utils.queryLLM(userPrompt)
}

module.exports={
    queryLLM
}