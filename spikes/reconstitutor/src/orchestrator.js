const fileRenamer = require('./common/fileRenamer');
const primaryFileFinder = require('./common/primaryFileFinder');
const primaryFileBuilder = require('./parsing/primaryFileParser');
const attachmentWriter = require('./common/attachmentWriter');
const path = require('path');

exports.processAllFiles = async () => {
    let totalPrimaryFilesProcessed = 0;
    let totalAttachmentsProcessed = 0;

    let targetFolder = process.argv[0];
    let outputFolder = process.argv[1];

    fileRenamer.renameAllFilesInFolder(targetFolder);
    let primaryFileFullPaths = await primaryFileFinder.findAllPrimaryFilesInFolder(targetFolder);

    primaryFileFullPaths.forEach(primaryFileFullPath => {

        let primaryFile = primaryFileBuilder.parse(primaryFileFullPath);

        primaryFile.attachments.forEach(attachment => {
            let outputFullFilePath = path.join(outputFolder, attachment.name);
            attachmentWriter.writeFileTo(attachment, outputFullFilePath);
            
            totalAttachmentsProcessed++;
        });

        totalPrimaryFilesProcessed++;
    });
    
    return {
        totalPrimaryFilesProcessed,
        totalAttachmentsProcessed
    };
}