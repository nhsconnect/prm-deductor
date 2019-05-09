require('./dataExtensions');
const fragmentFileParser = require('./fragmentFileParser');
const path = require('path');
const fs = require('fs');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath);
    let id = content.getMessageId();
    let partNumber = content.getPartNumber();
    let fragments = getAllFragments(content, fullFilePath);

    return {
        id,
        partNumber,
        fragments
    };
}

function getAllFragments(content, fullFilePath) {
    let fragmentReferences = content.getAllFragmentReferences();
    let fragments = [];
    fragmentReferences.forEach(fragmentReference => {
        if (isFragmentData(fragmentReference)) {
            let fragment = buildFragment(fragmentReference, content, fullFilePath);
            fragments.push(fragment);
        }
    });
    return fragments;
}

function buildFragment(fragmentReference, content, fullFilePath){
    let id = (isTheFirstPieceOfFragmentData(fragmentReference)) 
                        ? fragmentReference.getId()
                        : content.getMessageId();

    let parentFolder = path.dirname(fullFilePath).split(path.sep).pop();
    let fragment = fragmentFileParser.parse(path.join(parentFolder, id));

    return fragment;
}

function isFragmentData(fragmentReference) {
    return (fragmentReference.indexOf('cid:Content') < 0);
}

function isTheFirstPieceOfFragmentData(fragmentReference) {
    return (fragmentReference.indexOf('Attachment1') < 0);
}

String.prototype.getAllFragmentReferences = function() {
    return this.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}

String.prototype.getId = function() {
    return this.match(/xlink\:href=\"(.*?)(?=\">)/g)[0].slice(16);
}