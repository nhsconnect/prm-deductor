const attachmentReferenceParser = require('./attachmentReferenceParser');
const attachmentParser = require('./attachmentParser');
const fs = require('fs');
const path = require('path');

exports.parse = async (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath, 'utf8');
    let name = getPartName(content);
    let parentFolder = path.dirname(fullFilePath);
    let id = getMessageId(content);

    let attachmentReferences = getAllAttachmentReferences(content);
    let attachments = [];
    attachmentReferences.forEach(attachmentReference => {
        if (isFragmentData(attachmentReference)) {
            let attachment = attachmentReferenceParser.parse(attachmentReference);
            if (dataIsStoredInPrimaryFile(attachment)) {
                attachment.id = id;
            }
            let filePath = path.join(parentFolder, attachment.id);
            let attachmentData = attachmentParser.parse(filePath); 
            attachment.fragments = attachmentData.fragments;
            // add more metadata to attachment
            attachments.push(attachment);
        }
    });

    return {
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
    let x = content.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g); 
    return x[0].slice(14);
}

function isFragmentData(fragmentReference) {
    return fragmentReference.indexOf('cid:Content') < 0;
}

function dataIsStoredInPrimaryFile(attachment) {
    return attachment.id.indexOf('Attachment') > -1;
}