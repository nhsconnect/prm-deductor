const asyncHelper = require('./asyncHelper');
const findInFiles = require('find-in-files');
const fs = require('fs');
const fragmentFileBuilder = require('../src/fragmentBuilder');

exports.getAllFragmentsForLargeAttachment = async (largeAttachmentMessageId, folderPath) => {
    let fragmentInfoCollection = [];

    let indexFile = await findFilesContaining(largeAttachmentMessageId, folderPath);
    let primaryFragmentInfo = {
        fullFilePath: indexFile[0]
    }
    fragmentInfoCollection.push(primaryFragmentInfo);

    let indexFileContent = fs.readFileSync(primaryFragmentInfo.fullFilePath, 'utf8');
    let primaryFragmentFile = fragmentFileBuilder.build(indexFileContent);

    await asyncHelper.forEach(primaryFragmentFile.fragments, async (fragment) => {
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