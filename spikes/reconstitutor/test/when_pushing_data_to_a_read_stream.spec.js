const streamerator = require('../src/streamerator');

describe('When pushing data to a read stream', () => {
    let readStream, readOutput;
    let inputString = 'whassup?';

    beforeAll(async () => {
        readStream = streamerator.createReadStream();
        readStream.push(inputString);
        readOutput = readStream.read();
    })

    test("it should create a read stream", () => {
        expect(readStream).not.toBeUndefined();
    });
    
    test("it should output the data that was input", () => {
        expect(readOutput).toBe(inputString);
    });
});