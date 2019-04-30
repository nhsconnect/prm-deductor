const fileParser = require('./fileParser');

exports.retrieve_master_file = async (content) => {
    let name = getName(content);
    let files = getAllFiles(content);
    
    // for all attachments, add their data to the file
    let standardAttachments = files.filter(file => file.largeAttachment === false);
    await asyncForEach(standardAttachments, async (standardAttachment) => {
        standardAttachment.data = {};
    });

    // for all large attachments, collate their data to the file

    return {
        name,
        content,
        files
    };
}

function getName(content) {
    return content.match(/^------=_(.*?)\n/)[1];
}

function getAllFileReferences(content) {
    return content.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}

function getAllFiles(content) {
    let fileReferences = getAllFileReferences(content);
    let files = [];
    fileReferences.forEach(fileReference => {
        if (fileReference.indexOf('cid:Content') < 0) {
            files.push(fileParser.parseFile(fileReference));
        }
    });
    return files;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}