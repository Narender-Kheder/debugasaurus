const llm = require('./llm');
const terminal = require('./terminal');

// Combine and export all functions
module.exports = {
  ...llm, ...terminal
};