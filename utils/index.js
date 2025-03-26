const llm = require('./llm');
const terminal = require('./terminal');
const secrets = require('./secrets');
const interfaces = require('./interfaces')

// Combine and export all functions
module.exports = {
  ...llm, ...terminal, ...secrets, ...interfaces
};