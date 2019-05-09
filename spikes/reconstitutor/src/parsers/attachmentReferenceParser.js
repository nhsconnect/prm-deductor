exports.parse = (ebReferenceText) => {
    let fileInfo = getFileInfoElement(ebReferenceText);
    if (!fileInfo) {
        return '';
    }

    let id = getReferenceId(ebReferenceText);
    let name = getFilename(fileInfo);
    let contentType = getContentType(fileInfo);
    let largeAttachment = isALargeAttachment(fileInfo);
    let fileLength = getFileLength(fileInfo);
    
    let file = {
        id,
        name,
        contentType,
        largeAttachment,
        fileLength
    };

    return file;
}

function getReferenceId(content) {
    return content.match(/xlink\:href=\"(.*?)(?=\">)/g)[0].slice(16);
}

function getFilename(content) {
    let x = content.match(/Filename=\"(.*?)(?=\"\s)/g);
    return x[0].slice(10);
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

function getFileInfoElement(content) {
    let element = content.match(/(\<eb\:Description xml\:lang=\"en\"\>Filename)(.*?)(?=\<\/eb\:Description\>)/g);
    if (element) {
        element = element[0].slice(30);
    }
    return element;
}