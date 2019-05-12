const streamerator = require('./streamerator');
const path = require('path');

exports.writeFileTo = (attachment, outputFolder) => {
    let fullOutputFilePath = path.join(outputFolder, attachment.name);

    let read = streamerator.createReadStream();
    let write = streamerator.createWriteStream(fullOutputFilePath);
    read.pipe(write);

    attachment.fragments.forEach(fragment => {
        // get fragment data

        read.push('ss');
    });

    return 6;
}