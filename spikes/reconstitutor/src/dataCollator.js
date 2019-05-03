exports.appendDataToStandardAttachments = (primaryFile) => {
    let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
    let attachmentParts = getAllAttachmentParts(primaryFile);

    standardAttachments.forEach(standardAttachment => {
        standardAttachment.data = getAttachmentData(attachmentParts, standardAttachment.id);
        standardAttachment.encoding = getAttachmentEncoding(attachmentParts, standardAttachment.id);
    });

    return primaryFile;
}

function getAllAttachmentParts(primaryFile) {
    return primaryFile.content.split(`------=_${primaryFile.name}`).filter(part => {
        return part.length != 0 && part.indexOf('<Attachment') > -1
    });
}

function getAttachmentData(attachmentParts, attachmentId) {
    let partWithData = attachmentParts.find(attachmentPart => {
        return attachmentPart.indexOf(attachmentId) > -1
    });
    return getDataSegment(partWithData);
}

function getDataSegment(partWithData) {
    return partWithData.split('\n').filter(line => {
        return line.length != 0 && line.indexOf('Content-') === -1
    }).join('');
}

function getAttachmentEncoding(attachmentParts, attachmentId) {
    let partWithEncoding = attachmentParts.find(attachmentPart => {
        return attachmentPart.indexOf(attachmentId) > -1
    });
    return getEncodingSegment(partWithEncoding);
}

function getEncodingSegment(partWithEncoding) {
    let contentType = partWithEncoding.match(/Content-Transfer-Encoding:\s(.*?)(?=\s)/g)[0].slice(27);
    return contentType;
}