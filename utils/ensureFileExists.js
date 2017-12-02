const fs = require('fs');

function ensureFileExists(path) {
  if (!fs.existsSync(path)) {
    console.log(path + " not found");
    process.exit(-1);
  }
}

module.exports = ensureFileExists;
