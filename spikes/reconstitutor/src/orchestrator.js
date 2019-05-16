const fileRenamer = require('./common/fileRenamer');
const primaryFileFinder = require('./common/primaryFileFinder');
const primaryFileBuilder = require('./parsing/primaryFileParser');
const attachmentWriter = require('./common/attachmentWriter');
const path = require('path');
const fs = require('fs');

exports.processAllFiles = async () => {
    let totalPrimaryFilesProcessed = 0;
    let totalAttachmentsProcessed = 0;

    if (process.argv.length !== 3) {
        console.error('You need to supply both the targetFolder and the outputFolder');
    } else {
        let targetFolder = process.argv[1];
        let outputFolder = process.argv[2];

        console.log(`Renaming all files in folder: ${targetFolder}`);
        await fileRenamer.renameAllFilesInFolder(targetFolder);

        console.log(`Searching for all primary files in folder: ${targetFolder}`);
        let primaryFileFullPaths = await primaryFileFinder.findAllPrimaryFilesInFolder(targetFolder);

        primaryFileFullPaths.forEach(primaryFileFullPath => {

            console.log(`Processing primary file: ${primaryFileFullPath}`);

            let primaryFile = primaryFileBuilder.parse(primaryFileFullPath);

            WriteOutToJsonFile(outputFolder, primaryFile);

            console.log(`Outputting attachments to folder: ${outputFolder}`);
            primaryFile.attachments.forEach(attachment => {
                attachmentWriter.writeFileTo(attachment, outputFolder);
                
                totalAttachmentsProcessed++;
            });

            console.log(`Completed processing primary file: ${primaryFileFullPath}`);
            totalPrimaryFilesProcessed++;
        });
    }

    return {
        totalPrimaryFilesProcessed,
        totalAttachmentsProcessed
    };
}

function WriteOutToJsonFile(folder, data) {
    let fullPath = path.join(folder, 'primaryFile.json');
    let jsonData = JSON.stringify(data);
    fs.writeFileSync(fullPath, jsonData);
}