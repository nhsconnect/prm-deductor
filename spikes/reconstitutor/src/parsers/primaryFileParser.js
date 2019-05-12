const attachmentReferenceParser = require('./attachmentReferenceParser');
const attachmentFragmentBuilder = require('./attachmentFragmentBuilder');
const metadataExtractions = require('./metadataExtractions');
const fs = require('fs');
const path = require('path');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath, 'utf8');
    let name = metadataExtractions.getPartName(content);
    let id = metadataExtractions.getMessageId(content);
    
    let parentFolder = path.dirname(fullFilePath);
    
    let attachmentReferencesElements = getAllAttachmentReferences(content);
    let attachments = [];
    attachmentReferencesElements.forEach(attachmentReferenceElement => {
        if (metadataExtractions.isFragmentData(attachmentReferenceElement)) {
            let attachment = attachmentReferenceParser.parse(attachmentReferenceElement);
            attachment.fullFilePath = (metadataExtractions.hasDataStoredOnPrimaryFile(attachment)) 
                                            ? path.join(parentFolder, id)
                                            : path.join(parentFolder, attachment.id);
            attachment.fragments = attachmentFragmentBuilder.buildFragmentsFor(attachment); 
            
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