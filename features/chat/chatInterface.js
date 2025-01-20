const fs = require('fs')
const path = require('path')

function loadHTML (fileName) {
  return fs.readFileSync(path.join(__dirname, fileName), 'utf8')
}

module.exports = {
  loadHTML
}
