const fileParser = require('./fileParser');

exports.build = async (content) => {
    let name = getName(content);
    let attachments = getAllAttachments(content);

    return {
        name,
        content,
        attachments
    };
}

function getName(content) {
    let name = content.match(/^------=_(.*?)\n/);
    if (name) {
        return name[1];
    }
    return '';
}

function getAllAttachmentReferences(content) {
    return content.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}

function getAllAttachments(content) {
    let attachmentReferences = getAllAttachmentReferences(content);
    let attachments = [];
    attachmentReferences.forEach(attachmentReference => {
        if (attachmentReference.indexOf('cid:Content') < 0) {
            attachments.push(fileParser.parseFile(attachmentReference));
        }
    });
    return attachments;
}