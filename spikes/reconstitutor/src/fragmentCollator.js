const findInFiles = require('find-in-files');
const fs = require('fs');
const primaryFileBuilder = require('../src/masterFileBuilder');

exports.getIndexFileForLargeAttachment = async (id, folderPath) => {
    let indexFile = await findFilesContaining(id, folderPath);
    let indexFileContent = fs.readFileSync(indexFile[0], 'utf8');
    let primaryFile = await primaryFileBuilder.build(indexFileContent); 

    let files = [];
    files.push(indexFile[0]);
    for (let index = 0; index < primaryFile.attachments.length; index++) {
        const fragment = primaryFile.attachments[index];
        console.log(fragment);        
        let matches = await findFilesContaining(fragment.id, folderPath);
        for (let index = 0; index < matches.length; index++) {
            const match = matches[index]; 
            files.push(match);
        }
    }

    return files;
}

async function findFilesContaining(id, folderPath) {
    let searchTerm = `<message-id>${id}</message-id>`;
    let files = [];
    await findInFiles.find(searchTerm, folderPath)
                        .then(function(fileMatches) {
                            for (var fullFilePath in fileMatches) {
                                console.log(fullFilePath);
                                files.push(fullFilePath);
                            }
                        });
    return files;
}