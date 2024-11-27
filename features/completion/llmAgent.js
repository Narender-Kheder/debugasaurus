const utils = require('../../uitls')

async function queryLLM (userMessage) { 
    const systemMessage = "You are a code completion bot. You are given code, and the position of the users cursor. Read the code. IF the line is incomplete, provide the finished code following the cursor. IF the is complete, provide the next line.\n\n\n Here is the code input:\n"
    return utils.queryLLM(systemMessage + userMessage)
}

module.exports={
    queryLLM
}