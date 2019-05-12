const fragmentFileParser = require('./fragmentFileParser');
const metadataExtractions = require('./metadataExtractions');
const path = require('path');
const fs = require('fs');

exports.parse = (attachmentReference) => {
    let content = fs.readFileSync(attachmentReference.fullFilePath);
    let id = metadataExtractions.getMessageId(content); 
    let partNumber = metadataExtractions.getPartNumber(content);
    let fragments = getAllFragments(content, attachmentReference);

    return {
        id,
        fullFilePath: attachmentReference.fullFilePath,
        partNumber,
        fragments
    };
}

function getAllFragments(content, attachmentReference) {
    let fragments = [];
    let fragment = fragmentFileParser.parse(attachmentReference.fullFilePath);
    if (metadataExtractions.hasDataStoredOnPrimaryFile(attachmentReference)) {
        fragment.id = attachmentReference.id;
        fragment.filename = attachmentReference.name;
        fragments.push(fragment);
    } else {
        let fragmentReferences = getAllFragmentReferences(content); 
        fragments.push(fragment);
        fragmentReferences.forEach(fragmentReference => {
            if (metadataExtractions.isFragmentData(fragmentReference)) {
                if (isExternalDataFile(fragmentReference)) {
                    let fragment = buildFragment(fragmentReference, attachmentReference.fullFilePath); 
                    fragments.push(fragment);
                }
            }
        });
    }
    
    return fragments;
}

function buildFragment(fragmentReference, fullFilePath){
    let id = metadataExtractions.getReferenceId(fragmentReference); 

    let parentFolder = path.dirname(fullFilePath).split(path.sep).pop();
    let fragmentFilePath = path.join(parentFolder, id); 
    let fragment = fragmentFileParser.parse(fragmentFilePath); 

    return fragment;
}

function isExternalDataFile(fragmentReference) {
    return (fragmentReference.indexOf('cid:Attachment') < 0);
}

function getAllFragmentReferences(content) {
    return content.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}
