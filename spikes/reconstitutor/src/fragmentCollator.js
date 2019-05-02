const findInFiles = require('find-in-files');

exports.getIndexFileForLargeAttachment = async (id, folderPath) => {
    let files = [];
    let searchTerm = `<message-id>${id}</message-id>`;
    await findInFiles.find(searchTerm, folderPath)
                        .then(function(fileMatches) {
                            for (var fullFilePath in fileMatches) {
                                console.log(fullFilePath);
                                files.push(fullFilePath);
                            }
                        });

    return files[0];
}