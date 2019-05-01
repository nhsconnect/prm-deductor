const Stream = require('stream');

exports.createReadStream = () => {
    const stream = new Stream.Readable({
        objectMode: true,
        read() {}
    });
    return stream;
}

exports.createWriteStream = () => {
    stream = new Stream.Writable({
        objectMode: true,
        autoDestroy: true,
        write: (chunk, _, next) => {
            console.log(chunk.toString())
            next()
        }
      });
    return stream;
};