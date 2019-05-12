const attachmentReferenceParser = require('./attachmentReferenceParser');
const attachmentParser = require('./attachmentParser');
const metadataExtractions = require('./metadataExtractions');
const fs = require('fs');
const path = require('path');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath, 'utf8');
    let name = metadataExtractions.getPartName(content);
    let id = metadataExtractions.getMessageId(content);
    
    let parentFolder = path.dirname(fullFilePath);
    
    let primaryFileAttachmentReferences = getAllAttachmentReferences(content);
    let attachments = [];
    primaryFileAttachmentReferences.forEach(attachmentReference => {
        if (metadataExtractions.isFragmentData(attachmentReference)) {
            let attachment = attachmentReferenceParser.parse(attachmentReference);
            if (metadataExtractions.hasDataStoredOnPrimaryFile(attachment)) {
                attachment.fullFilePath = path.join(parentFolder, id);
            } else {
                attachment.fullFilePath = path.join(parentFolder, attachment.id);
            }
            let attachmentData = attachmentParser.parse(attachment); 
            attachment.fragments = attachmentData.fragments;
            
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

function getAllAttachmentReferences(content) {
    return content.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}