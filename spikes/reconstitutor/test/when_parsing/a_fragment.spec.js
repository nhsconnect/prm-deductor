const fragmentBuilder = require("../../src/parsers/fragmentFileParser");
const given = require("../given");
const fs = require('fs');
jest.mock('fs');

describe('When parsing a fragment file', () => {
    let fragmentFile;

    beforeAll(() => {
        jest.clearAllMocks();
        let fullFilePath = 'parentFolder/B48B8DC1-3C90-4817-8186-E2BA3B16E2EE';
        fs.readFileSync = (path) => { 
            return (path === fullFilePath) 
                    ? given.fragmentContent(96, 'B48B8DC1-3C90-4817-8186-E2BA3B16E2EE', 1) 
                    : '';
        };

        fragmentFile = fragmentBuilder.parse(fullFilePath);
    })

    test("it should have an id", () => {
        expect(fragmentFile.id).toBe('B48B8DC1-3C90-4817-8186-E2BA3B16E2EE');
    });

    test("it should have a fullFilePath", () => {
        expect(fragmentFile.fullFilePath).toBe('parentFolder/B48B8DC1-3C90-4817-8186-E2BA3B16E2EE');
    });

    test("it should have a partNumber", () => {
        expect(fragmentFile.partNumber).toBe(96);
    });

    test("it should have a filename", () => {
        expect(fragmentFile.filename).toBe('3D085A2B-E00F-44F8-AA85-6699D2D4B259_(Encoded Compressed=No Length=42810092) 2003-16_1.tif');
    });
});