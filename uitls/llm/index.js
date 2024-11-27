const llm = require('./llmcall.js');

// Combine and export all functions
module.exports = {
  ...llm
};