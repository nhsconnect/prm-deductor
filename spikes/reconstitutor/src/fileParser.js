exports.parseFile = (ebReferenceText) => {
    let id = ebReferenceText.match(/xlink\:href=\"(.*?)(?=\">)/g)[0].slice(16);

    let fileDescription = getAllFileDescriptions(ebReferenceText);
    if (!fileDescription) {
        return '';
    }
    const fileInfo = fileDescription[0].slice(30);
    let name = fileInfo.match(/Filename=\"(.*?)(?=\"\s)/g)[0].slice(10); 
    let contentType = fileInfo.match(/ContentType=(.*?)(?=\s)/g)[0].slice(12); 
    let largeAttachment = fileInfo.match(/LargeAttachment=(.*?)(?=\s)/g)[0].slice(16) === 'Yes'; 
    
    let lastInstanceOfLengthInText = fileInfo.slice(fileInfo.lastIndexOf('Length')); 
    let fileLength = parseInt(lastInstanceOfLengthInText.match(/Length=(\d*?)(?=\s|\<)/g)[0].slice(7)); 
    
    let file = {
        id,
        name,
        contentType,
        largeAttachment,
        fileLength
    };

    return file;
}

function getAllFileDescriptions(content) {
    return content.match(/(\<eb\:Description xml\:lang=\"en\"\>Filename)(.*?)\<\/eb\:Description\>/g);
}