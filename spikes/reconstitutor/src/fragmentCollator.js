const asyncHelper = require('./asyncHelper');
const findInFiles = require('find-in-files');
const fs = require('fs');
const primaryFileBuilder = require('../src/primaryFileBuilder');

exports.getAllFragmentsForLargeAttachment = async (id, folderPath) => {
    let fragmentInfoCollection = [];

    let indexFile = await findFilesContaining(id, folderPath);
    let primaryFragmentInfo = {
        fullFilePath: indexFile[0]
    }
    fragmentInfoCollection.push(primaryFragmentInfo);

    let indexFileContent = fs.readFileSync(indexFile[0], 'utf8');
    let primaryFile = await primaryFileBuilder.build(indexFileContent); 

    await asyncHelper.forEach(primaryFile.attachments, async (fragment) => {
        let fragmentFilesFound = await findFilesContaining(fragment.id, folderPath);
        await asyncHelper.forEach(fragmentFilesFound, async (fragmentFullFilePath) => {
            let fragmentInfo = {
                fullFilePath: fragmentFullFilePath
            }
            fragmentInfoCollection.push(fragmentInfo);
        })
    });

    return fragmentInfoCollection;
}

async function findFilesContaining(id, folderPath) {
    let searchTerm = `<message-id>${id}</message-id>`;
    let fullFilePaths = [];
    await findInFiles.find(searchTerm, folderPath)
                        .then(function(fileMatches) {
                            for (let fullFilePath in fileMatches) {
                                fullFilePaths.push(fullFilePath);
                            }
                        });
    return fullFilePaths;
}