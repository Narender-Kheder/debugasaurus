const utils = require('../../uitls')
// @ts-ignore
const aiPrompts = require('../prompts.json')

async function completionGeneration ({
  codeBeforeUser,
  userLine,
  codeAfterUser
}) {
  const prompts = aiPrompts.completion
  return isCommentTask(userLine)
    ? commentTask(prompts, codeBeforeUser, userLine, codeAfterUser)
    : oneLineGeneration(prompts, codeBeforeUser, codeAfterUser)
}

function commentTask (prompts, codeBeforeUser, userLine, codeAfterUser) {
  const userPrompt =
    prompts.comment_task_prompt +
    codeBeforeUser +
    '<&user is here&>' +
    codeAfterUser +
    '\n\nThe user command or user task:' +
    cleanComment(userLine)
    console.log(userPrompt);
  return utils.queryLLM(userPrompt)
}

function oneLineGeneration (prompts, codeBeforeUser, codeAfterUser) {
  const userPrompt =
    prompts.one_line_system_prompt +
    codeBeforeUser +
    '<&user is here&>' +
    codeAfterUser
  return utils.queryLLM(userPrompt)
}

const commentPattern = new RegExp(
  '//.*|/\\*[\\s\\S]*?\\*/|#.*|<!--[\\s\\S]*?-->|=begin[\\s\\S]*?=end',
  'g'
)
function isCommentTask (userLine) {
  return commentPattern.test(userLine)
}
function cleanComment (userLine) {
  return userLine.replace(commentPattern, '')
}

module.exports = {
  completionGeneration
}
