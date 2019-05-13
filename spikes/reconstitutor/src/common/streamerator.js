/* ignore file coverage: pretty basic stream functions wrapper */
const Stream = require('stream');
const fs = require('fs');

exports.createReadStream = () => {
    const stream = new Stream.Readable({
        objectMode: true,
        read() {}
    });
    return stream;
}

exports.createWriteStream = (outputFileFullPath) => {
    stream = fs.createWriteStream(outputFileFullPath);
    return stream;
};