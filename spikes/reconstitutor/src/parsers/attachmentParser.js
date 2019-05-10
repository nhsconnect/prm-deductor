const fragmentFileParser = require('./fragmentFileParser');
const path = require('path');
const fs = require('fs');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath);
    let id = getMessageId(content); 
    let partNumber = getPartNumber(content);
    let fragments = getAllFragments(content, fullFilePath);

    return {
        id,
        fullFilePath,
        partNumber,
        fragments
    };
}

function getAllFragments(content, fullFilePath) {
    let fragmentReferences = getAllFragmentReferences(content); 
    let fragments = [];
    let fragment = fragmentFileParser.parse(fullFilePath);
    fragments.push(fragment);
    fragmentReferences.forEach(fragmentReference => {
        if (isFragmentData(fragmentReference)) {
            if (isExternalDataFile(fragmentReference)) {
                let fragment = buildFragment(fragmentReference, fullFilePath); 
                fragments.push(fragment);
            }
        }
    });
    return fragments;
}

function buildFragment(fragmentReference, fullFilePath){
    let id = getReferenceId(fragmentReference); 

    let parentFolder = path.dirname(fullFilePath).split(path.sep).pop();
    let fragmentFilePath = path.join(parentFolder, id); //?
    let fragment = fragmentFileParser.parse(fragmentFilePath); 

    return fragment;
}

function getReferenceId(content) {
    return content.match(/xlink\:href=\"(.*?)(?=\">)/g)[0].slice(16);
}

function isFragmentData(fragmentReference) {
    return (fragmentReference.indexOf('cid:Content') < 0);
}

function isExternalDataFile(fragmentReference) {
    return (fragmentReference.indexOf('cid:Attachment') < 0);
}

function getAllFragmentReferences(content) {
    return content.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}

function getMessageId(content) {
    let x = content.match(/(?=\<eb:MessageId>)(.*?)(?=\<\/eb:MessageId>)/g); 
    return x[0].slice(14); 
}

function getPartNumber(content) {
    let number = content.match(/(^------=_Part_)(\d*?)(?=_)/)[0].slice(13);
    return parseInt(number);
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