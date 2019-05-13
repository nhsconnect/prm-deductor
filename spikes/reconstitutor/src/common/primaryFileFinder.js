const findInFiles = require('find-in-files');

exports.findAllPrimaryFilesInFolder = async (folderPath) => {
    let searchTermForPrimaryFiles = '<EhrExtract';
    let fullFilePaths = [];
    await findInFiles.find(searchTermForPrimaryFiles, folderPath)
                        .then(function(fileMatches) {
                            for (let fullFilePath in fileMatches) {
                                fullFilePaths.push(fullFilePath);
                            }
                        });
    return fullFilePaths; 
}