const llm = require('./llm');
const terminal = require('./terminal');
const secrets = require('./secrets');

// Combine and export all functions
module.exports = {
  ...llm, ...terminal, ...secrets
};