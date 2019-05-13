const fragmentFileParser = require('../parsing/fragmentFileParser');
const metadataExtractions = require('../common/metadataExtractions');
const path = require('path');
const fs = require('fs');

exports.buildFragmentsFor = (attachmentReference) => {
    let content = fs.readFileSync(attachmentReference.fullFilePath, 'utf8');
    let fragments = getAllFragments(content, attachmentReference);

    return fragments;
}

function getAllFragments(content, attachmentReference) {
    let fragments = [];
    let fragment = fragmentFileParser.parse(attachmentReference.fullFilePath);
    if (metadataExtractions.hasDataStoredOnPrimaryFile(attachmentReference)) {
        fragment.id = attachmentReference.id;
        fragment.filename = attachmentReference.name;
        fragments.push(fragment);
    } else {
        fragments.push(fragment);
        
        let fragmentReferences = getAllFragmentReferences(content); 
        fragmentReferences.forEach(fragmentReference => {
            if (metadataExtractions.isAttachmentData(fragmentReference)) {
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
