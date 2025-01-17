const fs = require('fs');
const path = require('path');

function loadHTML(fileName) {
    const filecontent =  fs.readFileSync(path.join(__dirname, fileName), 'utf8');
    console.log(filecontent)
    return filecontent
}

module.exports = {
  loadHTML
}
