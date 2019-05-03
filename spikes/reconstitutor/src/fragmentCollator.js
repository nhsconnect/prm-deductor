const findInFiles = require('find-in-files');
const fs = require('fs');
const primaryFileBuilder = require('../src/masterFileBuilder');

exports.getAllFragmentsForLargeAttachment = async (id, folderPath) => {
    let fragmentInfoCollection = [];

    let indexFile = await findFilesContaining(id, folderPath); //?
    let primaryFragmentInfo = {
        fullFilePath: indexFile[0]
    }
    fragmentInfoCollection.push(primaryFragmentInfo);

    let indexFileContent = fs.readFileSync(indexFile[0], 'utf8');
    let primaryFile = await primaryFileBuilder.build(indexFileContent); 

    for (let index = 0; index < primaryFile.attachments.length; index++) {
        const fragment = primaryFile.attachments[index]; 
        let fragmentFilesFound = await findFilesContaining(fragment.id, folderPath);
        for (let index = 0; index < fragmentFilesFound.length; index++) {
            const fragmentFullFilePath = fragmentFilesFound[index]; 
            let fragmentInfo = {
                fullFilePath: fragmentFullFilePath
            }
            fragmentInfoCollection.push(fragmentInfo);
        }
    }

    return fragmentInfoCollection;
}

async function findFilesContaining(id, folderPath) {
    let searchTerm = `<message-id>${id}</message-id>`;
    let fullFilePaths = [];
    await findInFiles.find(searchTerm, folderPath)
                        .then(function(fileMatches) {
                            fileMatches //?
                            for (let fullFilePath in fileMatches) {
                                fullFilePath //?
                                fullFilePaths.push(fullFilePath);
                            }
                        });
    return fullFilePaths; //?
}