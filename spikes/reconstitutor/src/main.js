const fileParser = require('./fileParser');

exports.retrieve_master_file = async (content) => {
    let name = getName(content);
    let files = getAllFiles(content);

    
    // for all attachments, add their data to the file

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

function getAllFileDescriptions(content) {
    return content.match(/(\<eb\:Description xml\:lang=\"en\"\>Filename)(.*?)\<\/eb\:Description\>/g);
}

function getAllFiles(content) {
    let fileDescriptions = getAllFileDescriptions(content);
    let files = [];
    fileDescriptions.forEach(fileInfo => {
        files.push(fileParser.parseFile(fileInfo));
    });
    return files;
}