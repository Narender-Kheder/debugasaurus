const llmAgent = require('./llmAgent.js');
const provider = require('./provider.js')

// Combine and export all functions
module.exports = {
  ...llmAgent, 
  ...provider
};