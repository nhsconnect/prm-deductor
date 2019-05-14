const fragmentParser = require("../../src/parsing/fragmentFileParser");
const fs = require('fs');
jest.mock('fs');

describe('When parsing a fragment file that does not exist', () => {
    let fragmentFile;

    beforeAll(() => {
        jest.clearAllMocks();
        
        let fullFilePath = 'parentFolder/B48B8DC1-3C90-4817-8186-E2BA3B16E2EE';
        fs.existsSync = (path) => {
            return false;
        }

        fragmentFile = fragmentParser.parse(fullFilePath);
    })

    test("it should have an id", () => {
        expect(fragmentFile).toEqual({});
    });
});