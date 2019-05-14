const metadataExtractions = require('../common/metadataExtractions');
const fs = require('fs');

exports.parse = (fullFilePath) => {
    if (!fs.existsSync(fullFilePath)) {
        console.log(`Fragment file not found for: ${fullFilePath}`);
        return {};
    }
    
    let content = fs.readFileSync(fullFilePath, 'utf8'); 
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

