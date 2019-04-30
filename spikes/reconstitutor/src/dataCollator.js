exports.appendDataToStandardAttachments = (parsedMasterFile) => {
    let standardAttachments = parsedMasterFile.attachments.filter(file => file.largeAttachment === false);

    let attachmentParts = parsedMasterFile.content.split(`------=_${parsedMasterFile.name}`).filter(part => {
        return part.length != 0 && part.indexOf('<Attachment') > -1
    });
    standardAttachments.forEach(standardAttachment => {
        let x = attachmentParts.find(attachment => {
            return attachment.indexOf(standardAttachment.id) > -1
        })
        let data = x.split('\n').filter(line => {
            return line.length != 0 && line.indexOf('Content-') === -1
        }).join('');
        standardAttachment.data = data;
    });

    return parsedMasterFile;
}