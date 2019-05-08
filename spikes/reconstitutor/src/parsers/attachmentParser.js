require('./dataExtensions');
const fs = require('fs');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath);
    let id = content.getMessageId();
    let partNumber = content.getPartNumber();
    let fragments = getAllFragments(content);

    return {
        id,
        partNumber,
        fragments
    };
}

function getAllFragments(content) {
    let fragmentReferences = content.getAllFragmentReferences();
    let fragments = [];
    fragmentReferences.forEach(fragmentReference => {
        if (isFragmentData(fragmentReference)) {
            let fragment = buildFragment(fragmentReference, content);
            fragments.push(fragment);
        }
    });
    return fragments;
}

String.prototype.getAllFragmentReferences = function() {
    return this.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}

String.prototype.getId = function() {
    return this.match(/xlink\:href=\"(.*?)(?=\">)/g)[0].slice(16);
}

function isFragmentData(fragmentReference) {
    return (fragmentReference.indexOf('cid:Content') < 0);
}

function isTheFirstPieceOfFragmentData(fragmentReference) {
    return (fragmentReference.indexOf('Attachment1') < 0);
}

function buildFragment(fragmentReference, content){
    let id = (isTheFirstPieceOfFragmentData(fragmentReference)) 
                        ? fragmentReference.getId()
                        : content.getMessageId();
    let fragment = {
        id
    };

    return fragment;
}