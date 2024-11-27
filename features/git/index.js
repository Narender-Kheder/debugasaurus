const gitError = require('./gitError.js');
const provider = require('./provider.js')

// Combine and export all functions
module.exports = {
  ...gitError,
  ...provider
};