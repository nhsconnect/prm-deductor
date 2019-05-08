const attachmentFileParser = require("../../src/parsers/attachmentParser");
const given = require("../given");
const fs = require('fs');
jest.mock('fs');

describe('When parsing an attachment', () => {
    let attachmentFile;

    beforeAll(() => {
        let fullFilePath = 'parentFolder/someDoc';
        fs.readFileSync = (path) => { 
            return (path === fullFilePath) ? given.attachmentFileContent : '';
        };

        attachmentFile = attachmentFileParser.parse(fullFilePath);
    })

    test("it should have an id", () => {
        expect(attachmentFile.id).toBe('E5EE718C-2577-401B-AFC3-CB651FD3011F');
    });

    test("it should have a partNumber", () => {
        expect(attachmentFile.partNumber).toBe(95);
    });
    
    test("it should have a fragments collection", () => {
        expect(attachmentFile.fragments).not.toBeUndefined();
    });

    test("the fragments collection should be populated", () => {
        expect(attachmentFile.fragments.length).toBe(10);
    });

    test("the first fragment should be the attachment primary file itself", () => {
        expect(attachmentFile.fragments[0].id).toBe('E5EE718C-2577-401B-AFC3-CB651FD3011F');
    });
});