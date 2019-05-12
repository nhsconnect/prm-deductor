exports.getMessageId = (content) => {
    let messageId = content.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g); 
    return (messageId) ? messageId[0].slice(14) : ''; 
}

exports.getPartNumber = (content) => {
    let number = content.match(/(^------=_Part_)(\d*?)(?=_)/);
    return (number) ? parseInt(number[0].slice(13)) : '';
}

exports.getFilename = (content) => {
    let filename = content.match(/Filename=\"(.*?)(?=\"\s)/g);
    return (filename) ? filename[0].slice(10) : '';
}

exports.getSubjectFilename = (content) => {
    let filename = content.match(/(\<subject\>Attachment:\s)(.*?)(?=\<\/subject\>)/); 
    if (filename) {
        return filename[0].slice(21);
    } else {
        return this.getFilename(content);
    }
}

exports.getReferenceId = (content) => {
    let refId = content.match(/xlink\:href=\"(.*?)(?=\">)/g);
    return (refId) ? refId[0].slice(16) : '';
}

exports.isFragmentData = (fragmentReference) => {
    return fragmentReference.indexOf('cid:Content') < 0;
}

exports.getPartName = (content) => {
    let name = content.match(/^------=_(.*?)\n/);
    return (name) ? name[1] : '';
}

exports.hasDataStoredOnPrimaryFile = (attachmentReference) => {
    return (attachmentReference.id.indexOf('Attachment') > -1);
}