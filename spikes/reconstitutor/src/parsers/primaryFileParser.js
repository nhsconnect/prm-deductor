const attachmentReferenceParser = require('./attachmentReferenceParser');
const attachmentParser = require('./attachmentParser');
const fs = require('fs');
const path = require('path');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath, 'utf8');
    let name = getPartName(content);
    let parentFolder = path.dirname(fullFilePath);
    let id = getMessageId(content);

    let primaryFileAttachmentReferences = getAllAttachmentReferences(content);
    let attachments = [];
    primaryFileAttachmentReferences.forEach(attachmentReference => {
        if (isFragmentData(attachmentReference)) {
            let attachment = attachmentReferenceParser.parse(attachmentReference);
            if (dataIsStoredInPrimaryFile(attachment)) {
                attachment.fullFilePath = path.join(parentFolder, id);
            } else {
                attachment.fullFilePath = path.join(parentFolder, attachment.id);
            }
            let attachmentData = attachmentParser.parse(attachment); 
            attachment.fragments = attachmentData.fragments;
            
            // add more metadata to attachment
            attachments.push(attachment);
        }
    });

    return {
        id,
        fullFilePath,
        name,
        content,
        attachments
    };
}

function getPartName(content) {
    let name = content.match(/^------=_(.*?)\n/);
    return name[1];
}

function getAllAttachmentReferences(content) {
    return content.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}

function getMessageId(content) {
    return content.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g)[0].slice(14);
}

function isFragmentData(fragmentReference) {
    return fragmentReference.indexOf('cid:Content') < 0;
}

function dataIsStoredInPrimaryFile(attachment) {
    return attachment.id.indexOf('Attachment') > -1;
}