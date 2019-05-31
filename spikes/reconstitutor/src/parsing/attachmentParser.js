const metadataExtractions = require('../common/metadataExtractions');

exports.parse = (ebReferenceText) => {
    let id = metadataExtractions.getReferenceId(ebReferenceText);
    
    let fileInfo = metadataExtractions.getFileInfoElement(ebReferenceText); //?
    let name = metadataExtractions.getFilename(fileInfo);
    let contentType = getContentType(fileInfo);
    let largeAttachment = isALargeAttachment(fileInfo);
    let fileLength = getFileLength(fileInfo);
    let isCompressed = getIsCompressed(fileInfo);

    return {
        id,
        isCompressed,
        name,
        contentType,
        largeAttachment,
        fileLength
    };
}

function getContentType(content) {
    return content.match(/ContentType=(.*?)(?=\s)/g)[0].slice(12); 
}

function isALargeAttachment(content) {
    return content.match(/LargeAttachment=(.*?)(?=\s)/g)[0].slice(16) === 'Yes';
}

function getFileLength(content) {
    let lastInstanceOfLengthInText = content.slice(content.lastIndexOf('Length')); 
    let fileLength = parseInt(lastInstanceOfLengthInText.slice(7)); 
    return fileLength;
}

function getIsCompressed(content) {
    let isCompressed = content.match(/(\sCompressed=)(.*?)(?=\s)/)[0].split('=')[1];
    return isCompressed === 'Yes';
}