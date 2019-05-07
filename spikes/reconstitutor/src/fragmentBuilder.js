const fs = require('fs');

exports.build = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath);
    let id = getMessageId(content);
    let partNumber = parseInt(getPartNumber(content));

    return {
        id,
        partNumber
    };
}

function getMessageId(content) {
    return content.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g)[0].slice(14);
}

function getPartNumber(content) {
    return content.match(/(^------=_Part_)(\d*?)(?=_)/)[0].slice(13);
}