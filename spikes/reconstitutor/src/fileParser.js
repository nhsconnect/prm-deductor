exports.parseFile = (ebReferenceText) => {
    let fileInfo = ebReferenceText.getFileInfoElement();
    if (!fileInfo) {
        return '';
    }

    let id = ebReferenceText.getId();
    let name = fileInfo.getFilename();
    let contentType = fileInfo.getContentType();
    let largeAttachment = fileInfo.isALargeAttachment();
    let fileLength = fileInfo.getFileLength();
    
    let file = {
        id,
        name,
        contentType,
        largeAttachment,
        fileLength
    };

    return file;
}

String.prototype.getId = function() {
    return this.match(/xlink\:href=\"(.*?)(?=\">)/g)[0].slice(16);
}

String.prototype.getFilename = function() {
    return this.match(/Filename=\"(.*?)(?=\"\s)/g)[0].slice(10);
}

String.prototype.getContentType = function() {
    return this.match(/ContentType=(.*?)(?=\s)/g)[0].slice(12); 
}

String.prototype.isALargeAttachment = function() {
    return this.match(/LargeAttachment=(.*?)(?=\s)/g)[0].slice(16) === 'Yes';
}

String.prototype.getFileLength = function() {
    let lastInstanceOfLengthInText = this.slice(this.lastIndexOf('Length')); 
    let fileLength = parseInt(lastInstanceOfLengthInText.match(/Length=(\d*?)(?=\s|\<)/g)[0].slice(7)); 
    return fileLength;
}

String.prototype.getFileInfoElement = function() {
    let element = this.match(/(\<eb\:Description xml\:lang=\"en\"\>Filename)(.*?)\<\/eb\:Description\>/g);
    if (element) {
        element = element[0].slice(30);
    }
    return element;
}