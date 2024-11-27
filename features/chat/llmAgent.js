const utils = require('../../uitls')

async function queryLLM (userMessage) { return utils.queryLLM(userMessage)}

module.exports={
    queryLLM
}