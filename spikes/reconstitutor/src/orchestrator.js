const masterFileBuilder = require('./masterFileBuilder');
const dataCollator = require('./dataCollator');
const streamerator = require('./streamerator');


exports.doSomething = async (content) => {

    masterFile = await masterFileBuilder.build(content);
    masterFile = await dataCollator.appendDataToStandardAttachments(masterFile);

    let numberOfExtractedFiles = 0;
    let standardAttachments = masterFile.attachments.filter(file => file.largeAttachment === false);
    standardAttachments.forEach(attachment => {
        writeData(attachment.data);
        numberOfExtractedFiles++;
    });

    let largeAttachments = masterFile.attachments.filter(file => file.largeAttachment === true);
    largeAttachments.forEach(attachment => {
        // get all files for large attachment ...
        // for each file, get fragment attachment data
        writeData(attachment);
        numberOfExtractedFiles++;
    });
    
    return numberOfExtractedFiles;
}

function writeData(data) {
    let read = streamerator.createReadStream();
    let write = streamerator.createWriteStream();
    read.pipe(write);
    if (data) {
        read.push(data);
    }
    read.push(null);    
}