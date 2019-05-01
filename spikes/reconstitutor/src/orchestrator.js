const masterFileBuilder = require('./masterFileBuilder');
const dataCollator = require('./dataCollator');
const streamerator = require('./streamerator');


exports.doSomething = async (content) => {

    masterFile = await masterFileBuilder.build(content);
    masterFile = await dataCollator.appendDataToStandardAttachments(masterFile);

    let numberOfExtractedFiles = 0;
    let standardAttachments = masterFile.attachments.filter(file => file.largeAttachment === false);
    standardAttachments.forEach(attachment => {
        let read = streamerator.createReadStream();
        let write = streamerator.createWriteStream();
        write.on('pipe', () => { 
            numberOfExtractedFiles++;
            console.log(numberOfExtractedFiles);
        });
        read.pipe(write);
        read.push(attachment.data);
        read.push(null);
    });
    
    return numberOfExtractedFiles;
}