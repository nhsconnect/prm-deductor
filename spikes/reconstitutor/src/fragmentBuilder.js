const fs = require('fs');

exports.build = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath);
    let id = content.getMessageId();
    let partNumber = content.getPartNumber();

    return {
        id,
        partNumber
    };
}

String.prototype.getMessageId = function() {
    return this.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g)[0].slice(14);
}

String.prototype.getPartNumber = function() {
    let number = this.match(/(^------=_Part_)(\d*?)(?=_)/)[0].slice(13);
    return parseInt(number);
}

