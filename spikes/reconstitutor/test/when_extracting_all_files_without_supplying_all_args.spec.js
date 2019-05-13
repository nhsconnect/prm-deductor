const orchestrator = require("../src/orchestrator");

describe('When extracting all files in a folder without supplying all args', () => {
    const spyErrorLog = jest.spyOn( console, 'error' );

    let targetFolder, result;

    beforeAll(async () => {
        jest.clearAllMocks();

        targetFolder = 'someFolder';

        process.argv = [
            targetFolder
        ];

        result = await orchestrator.processAllFiles();
    })

    test("it should output an error to state all arguments are required", () => {
        expect(spyErrorLog).toHaveBeenCalledWith('You need to supply both the targetFolder and the outputFolder');
    });

    test('it should return a detailed report', () => {
        expect(result).toEqual({
            totalPrimaryFilesProcessed: 0,
            totalAttachmentsProcessed: 0
        });
    });
});