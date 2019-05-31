const metadataExtractions = require('./metadataExtractions');
const fs = require('fs');
const path = require('path');

exports.renameAllFilesInFolder = (folder) => {
    let totalFilesRenamed = 0;

    let files = fs.readdirSync(folder);

    files.forEach(file => {
        if (file !== '.DS_Store') {
            let originalName = path.join(folder, file);
            let content = fs.readFileSync(originalName, 'utf8');
            console.log(`Renaming file: ${originalName}`);
            let messageId = metadataExtractions.getMessageId(content);
            let newFileName = path.join(folder, messageId);
            fs.renameSync(originalName, newFileName);
            console.log(`Renamed file to: ${newFileName}`);
            totalFilesRenamed++;
        }
    });

    return {
        totalFilesRenamed
    };
}