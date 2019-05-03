const streamerator = require('../src/streamerator');

describe('When writing with a write stream', () => {
    jest.setTimeout(120000);

    const spyLog = jest.spyOn( console, 'log' );

    let writeStream;
    let inputString = 'whassup?';

    beforeAll(() => {
        writeStream = streamerator.createWriteStream();
        writeStream.write(inputString);
    })

    test("it should create a write stream", () => {
        expect(writeStream).not.toBeUndefined();
    });
    
    test("it should log a structured event", () => {
        expect(spyLog).toHaveBeenCalledWith(inputString);
    });
});