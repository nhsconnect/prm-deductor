exports.parseFile = (ebDescriptionText) => {
    const fileInfo = ebDescriptionText.slice(30);
    let name = fileInfo.match(/Filename=\"(.*?)(?=\"\s)/g)[0].slice(10); 
    let contentType = fileInfo.match(/ContentType=(.*?)(?=\s)/g)[0].slice(12); 
    let largeAttachment = fileInfo.match(/LargeAttachment=(.*?)(?=\s)/g)[0].slice(16) === 'Yes'; 
    
    let lastInstanceOfLengthInText = fileInfo.slice(fileInfo.lastIndexOf('Length')); 
    let fileLength = parseInt(lastInstanceOfLengthInText.match(/Length=(\d*?)(?=\s|\<)/g)[0].slice(7)); 
    
    let file = {
        name,
        contentType,
        largeAttachment,
        fileLength
    };

    return file;
}