const fragmentFileParser = require('./fragmentFileParser');
const path = require('path');
const fs = require('fs');

exports.parse = (attachmentReference) => {
    attachmentReference //?

    let content = fs.readFileSync(attachmentReference.fullFilePath);
    let id = getMessageId(content); 
    let partNumber = getPartNumber(content);
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
    let attachmentParts = getAllAttachmentParts(content); //?
    let targetAttachmentPart = getAttachmentPart(attachmentParts, attachmentReference.id);

    targetAttachmentPart //?

    let fragment = fragmentFileParser.parse(attachmentReference.fullFilePath);
    fragments.push(fragment);
    return fragments;
}

function buildFragment(fragmentReference, fullFilePath){
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

function getPartName(content) {
    let name = content.match(/^------=_(.*?)\n/);
    return name[1];
}



function getAllAttachmentParts(content) {
    let partName = getPartName(content);
    return content.split(`------=_${partName}`).filter(part => {
        return part.length != 0 && part.indexOf('<Attachment') > -1
    });
}

function getAttachmentPart(attachmentParts, attachmentId) {
    attachmentParts.find(attachmentPart => {
        return attachmentPart.indexOf(attachmentId) > -1
    });
    return undefined;
}

function getAttachmentData(attachmentParts, attachmentId) {
    let partWithData = getAttachmentPart(attachmentParts, attachmentId);
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

function isPrimaryFileStandardAttachment(attachmentReference) {
    return attachmentReference.fullFilePath.indexOf(attachmentReference.id) === -1;
}