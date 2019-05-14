const attachmentParser = require('../parsing/attachmentParser');
const fragmentBuilder = require('../building/attachmentFragmentBuilder');
const metadataExtractions = require('../common/metadataExtractions');
const fs = require('fs');
const path = require('path');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath, 'utf8');
    let name = metadataExtractions.getPartName(content); //?
    let id = metadataExtractions.getMessageId(content);

    let parentFolder = path.dirname(fullFilePath);

    let attachmentReferencesElements = getAllAttachmentReferences(content);
    let attachments = [];
    attachmentReferencesElements.forEach(attachmentReferenceElement => {
        if (metadataExtractions.isAttachmentData(attachmentReferenceElement)) {
            let attachment = attachmentParser.parse(attachmentReferenceElement);
            attachment.fullFilePath = (metadataExtractions.hasDataStoredOnPrimaryFile(attachment)) 
                                                    ? path.join(parentFolder, id)
                                                    : path.join(parentFolder, attachment.id);
            attachment.fragments = fragmentBuilder.buildFragmentsFor(attachment); 

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