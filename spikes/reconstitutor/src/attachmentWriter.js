const streamerator = require('./streamerator');
const path = require('path');
const fs = require('fs');

exports.writeFileTo = (attachment, outputFolder) => {
    let fullOutputFilePath = path.join(outputFolder, attachment.name);

    let read = streamerator.createReadStream();
    let write = streamerator.createWriteStream(fullOutputFilePath);
    read.pipe(write);

    attachment.fragments.forEach(fragment => {
        let fragmentData = getFragmentData(fragment);
        read.push(fragmentData);
    });

    return 0;
}

function getFragmentData(fragment) {
    let dataFile = fs.readFileSync(fragment.fullFilePath);
    let data = getAttachmentData(dataFile, fragment);

    return data;
}

function getAllAttachmentParts(content, partName) {
    return content.split(`------=_${partName}`).filter(part => {
        return part.length != 0 && part.indexOf('<Attachment') > -1
    });
}

function getAttachmentData(content, fragment) {
    let attachmentParts = getAllAttachmentParts(content, fragment.partName)
    let partWithData = attachmentParts.find(attachmentPart => {
        return attachmentPart.indexOf(fragment.id) > -1
    });
    return getDataSegment(partWithData);
}

function getDataSegment(partWithData) {
    return partWithData.split('\n').filter(line => {
        return line.length != 0 && line.indexOf('Content-') === -1
    }).join('');
}