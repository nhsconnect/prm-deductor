const metadataExtractions = require('../common/metadataExtractions');
const fs = require('fs');

exports.parse = (fullFilePath) => {
    let content = fs.readFileSync(fullFilePath); 
    let id = metadataExtractions.getMessageId(content); 
    let partName = metadataExtractions.getPartName(content); 
    let filename = metadataExtractions.getSubjectFilename(content); 

    let fragment = {
        id,
        partName,
        filename,
        fullFilePath
    };

    return fragment;
}

