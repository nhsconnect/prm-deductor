require('./dataExtensions');
const fs = require('fs');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath);
    let id = content.getMessageId();
    let partNumber = content.getPartNumber();
    let filename = content.getFilename();

    return {
        id,
        partNumber,
        filename
    };
}
