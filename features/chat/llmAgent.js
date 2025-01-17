const utils = require('../../uitls')
const git = require('../git')

async function queryLLM (userMessage, document) { 

    const systemMessage = "You are a coding companion. You are given code, and your job is to answer the users question. DO NOT answer with any topic other then code or programming. You may answer regarding the code or any code related topic. If you are asked to generate ore code, please provide it in a clear fashion, do not explain. \n Here is the code input:\n"
    
    const code = document.getText()

    let userPrompt = systemMessage + code

    try {
        userPrompt += "You will be provided the users git status. You must answer any questions the user has about git and their git status.\nHere is the users git status:" + await git.checkGitErrors()
    } catch (error) {
        console.log("git check for llm didnt work")
    }

    userPrompt+= "\n\nUse the data above to answer this users question:\n"+ userMessage

    console.log(userPrompt)
    
    return utils.queryLLM(userPrompt)
}

module.exports={
    queryLLM
}