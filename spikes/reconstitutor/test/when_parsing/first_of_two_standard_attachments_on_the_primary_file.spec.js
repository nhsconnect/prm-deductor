const attachmentParser = require("../../src/parsers/attachmentParser");
const given = require("../given");
const fs = require('fs');
jest.mock('fs');

describe('When parsing the first of two standard attachments stored on the primary file', () => {
    let attachment, attachmentFile;

    beforeAll(() => {
        jest.clearAllMocks();

        attachment = { 
            id: 'Attachment1@e-mis.com/EMISWeb/GP2GP2.2A',
            name: '72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp',
            fullFilePath: 'parentFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95'
        };

        fs.readFileSync = (filePath) => { 
            if (filePath === attachment.fullFilePath) {
                return given.primaryFileContentWithTwoStandardAttachments;
            }
            return '';
        };

        attachmentFile = attachmentParser.parse(attachment);
    })

    test("it should have the same Id as the primary file", () => {
        expect(attachmentFile.id).toBe('0F28A313-EEDB-413E-9D41-BED8213DCB95');
    });

    test("it should have a partNumber", () => {
        expect(attachmentFile.partNumber).toBe(82);
    });
    
    test("it should have a fragments collection", () => {
        expect(attachmentFile.fragments).not.toBeUndefined();
    });

    test("the fragments collection should have a single item", () => {
        expect(attachmentFile.fragments.length).toBe(1);
    });

    test("the fragment should have the Id of the attachment part", () => {
        expect(attachmentFile.fragments[0].id).toBe(attachment.id);
    });

    test("the fragment filename should be the original file", () => {
        expect(attachmentFile.fragments[0].filename).toEqual(attachment.name);
    });

    test("the fragment file path should be the primary file", () => {
        expect(attachmentFile.fragments[0].fullFilePath).toEqual(attachment.fullFilePath);
    });
});