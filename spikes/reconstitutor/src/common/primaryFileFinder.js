let findInFiles = require('find-in-files');

let targetFolder = '/Users/christiantaylor/Downloads/84106041-3FD6-4A48-BEA4-2A1CBA2D2880\ 2';



/* ignore file coverage: expensinve find-in-files wrapper */
exports.findAllPrimaryFilesInFolder = async (folderPath) => {
    let searchTerm = '<EhrExtract';
    let fullFilePaths = [];
    await findInFiles.find(searchTerm, folderPath)
                        .then(function(fileMatches) {
                            for (let fullFilePath in fileMatches) {
                                fullFilePaths.push(fullFilePath);
                            }
                        });
    return fullFilePaths; 
}