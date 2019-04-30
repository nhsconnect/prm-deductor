const fileParser = require('./fileParser');

exports.retrieve_master_file = async (content) => {
    let name = getName(content);
    let files = getAllFiles(content);
    
    // for all attachments, add their data to the file
    let standardAttachments = files.filter(file => file.largeAttachment === false);

    let attachmentParts = content.split('------=_Part_82_12073865.1555409597528').filter(part => {
        return part.length != 0 && part.indexOf('<Attachment') > -1
    }); 
    await asyncForEach(standardAttachments, async (standardAttachment) => {
        let x = attachmentParts.find(attachment => {
            return attachment.indexOf(standardAttachment.id) > -1
        })
        let data = x.split('\n').filter(line => {
            return line.length != 0 && line.indexOf('Content-') === -1
        }).join('');
        standardAttachment.data = data;
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