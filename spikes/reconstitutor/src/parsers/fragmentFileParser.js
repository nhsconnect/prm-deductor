const fs = require('fs');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath); //?
    let id = getMessageId(content); //?
    let partNumber = getPartNumber(content); //?
    let filename = getSubjectFilename(content); //?

    return {
        id,
        fullFilePath,
        partNumber,
        filename
    };
}

function getMessageId(content) {
    let messageId = content.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g);
    return (messageId) ? messageId[0].slice(14) : '';
}

function getPartNumber(content) {
    let number = content.match(/(^------=_Part_)(\d*?)(?=_)/);
    return (number) ? parseInt(number[0].slice(13)) : '';
}

function getSubjectFilename(content) {
    let filename = content.match(/(\<subject\>Attachment:\s)(.*?)(?=\<\/subject\>)/); 
    if (filename) {
        return filename[0].slice(21);
    } else {
        return getFilename(content);
    }
}

function getFilename(content) {
    let filename = content.match(/Filename=\"(.*?)(?=\"\s)/g);
    return (filename) ? filename[0].slice(10) : '';
}