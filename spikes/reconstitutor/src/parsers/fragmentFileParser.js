const metadataExtractions = require('./metadataExtractions');
const fs = require('fs');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath); 
    let id = metadataExtractions.getMessageId(content); 
    let partNumber = metadataExtractions.getPartNumber(content); 
    let filename = metadataExtractions.getSubjectFilename(content); 

    return {
        id,
        fullFilePath,
        partNumber,
        filename
    };
}