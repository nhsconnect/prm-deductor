const fs = require('fs');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath);
    let id = getMessageId(content);
    let partNumber = getPartNumber(content);
    let filename = getSubjectFilename(content);

    return {
        id,
        fullFilePath,
        partNumber,
        filename
    };
}

function getMessageId(content) {
    return content.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g)[0].slice(14);
}

function getPartNumber(content) {
    let number = content.match(/(^------=_Part_)(\d*?)(?=_)/)[0].slice(13);
    return parseInt(number);
}

function getSubjectFilename(content) {
    let x = content.match(/(\<subject\>Attachment:\s)(.*?)(?=\<\/subject\>)/); 
    if (x) {
        return x[0].slice(21);
    } else {
        return getFilename(content);
    }
}

function getFilename(content) {
    return content.match(/Filename=\"(.*?)(?=\"\s)/g)[0].slice(10);
}