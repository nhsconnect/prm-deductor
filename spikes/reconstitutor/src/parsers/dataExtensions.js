String.prototype.getMessageId = function() {
    let x = this.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g); //?
    if (x == null) {
        this //?
    }
    return x[0].slice(14);
}

String.prototype.getPartNumber = function() {
    let number = this.match(/(^------=_Part_)(\d*?)(?=_)/)[0].slice(13);
    return parseInt(number);
}

String.prototype.getFilename = function() {
    return this.match(/(\<subject\>Attachment:\s)(.*?)(?=\<\/subject\>)/)[0].slice(21);
}