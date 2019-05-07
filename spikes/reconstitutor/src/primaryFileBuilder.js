const fileParser = require('./fileParser');

exports.build = async (content) => {
    let name = content.getPartName();
    let attachments = getAllAttachments(content);

    return {
        name,
        content,
        attachments
    };
}

function getAllAttachments(content) {
    let attachmentReferences = content.getAllAttachmentReferences();
    let attachments = [];
    attachmentReferences.forEach(attachmentReference => {
        if (attachmentReference.indexOf('cid:Content') < 0) {
            attachments.push(fileParser.parseFile(attachmentReference));
        }
    });
    return attachments;
}

String.prototype.getPartName = function() {
    let name = this.match(/^------=_(.*?)\n/);
    return name[1];
}

String.prototype.getAllAttachmentReferences = function() {
    return this.match(/(\<eb\:Reference)(.*?)\<\/eb\:Reference\>/g);
}