const streamerator = require('../src/streamerator');

describe.skip('When writing with a write stream', () => {
    
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