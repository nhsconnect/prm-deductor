const metadataExtractions = require('../common/metadataExtractions');
const fs = require('fs');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath); 
    let id = metadataExtractions.getMessageId(content); 
    let getPartName = metadataExtractions.getPartName(content); 
    let filename = metadataExtractions.getSubjectFilename(content); 

    return {
        id,
        fullFilePath,
        getPartName,
        filename
    };
}