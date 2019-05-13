const metadataExtractions = require('./metadataExtractions');
const fs = require('fs');
const path = require('path');

exports.renameAllFilesInFolder = (folder) => {
    let totalFilesRenamed = 0;

    let files = fs.readdirSync(folder);

    files.forEach(file => {
        let content = fs.readFileSync(file);
        let messageId = metadataExtractions.getMessageId(content);
        let newFileName = path.join(folder, messageId);
        fs.renameSync(file, newFileName);
        totalFilesRenamed++;
    });

    return {
        totalFilesRenamed
    };
}