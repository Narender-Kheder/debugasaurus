const utils = require('../../uitls')
const aiPrompts = require("../prompts.json");

async function queryLLM (userMessage) { 
    const prompts = aiPrompts.completion
    return utils.queryLLM(prompts.system_prompt + userMessage)
}

module.exports={
    queryLLM
}