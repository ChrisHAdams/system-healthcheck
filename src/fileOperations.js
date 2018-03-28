
exports.writeLineToFile = function (log, path, fileName, outputString) {

  const fs = require('fs');

  fs.appendFileSync(`${path}/${fileName}`, `\n${outputString}`, (err) => {
      if (err) throw err;
      log.error(err);
  });
}
