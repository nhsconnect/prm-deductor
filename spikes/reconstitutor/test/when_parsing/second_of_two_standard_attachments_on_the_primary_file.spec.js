const attachmentFileParser = require("../../src/parsers/attachmentParser");
const given = require("../given");
const fs = require('fs');
jest.mock('fs');

describe.skip('When parsing the second of two standard attachments stored on the primary file', () => {
    let attachmentFile;

    beforeAll(() => {
        jest.clearAllMocks();

        let attachmentReference = { 
            id: 'Attachment1@e-mis.com/EMISWeb/GP2GP2.2A',
            name: '72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp',
            contentType: 'application/octet-stream',
            largeAttachment: false,
            fileLength: 72580
        };

        let fullFilePath = 'parentFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95';
        fs.readFileSync = (filePath) => { 
            if (filePath === fullFilePath) {
                return given.primaryFileContentWithTwoStandardAttachments;
            }
            return '';
        };

        attachmentFile = attachmentFileParser.parse(fullFilePath);
    })

    test("it should have an id", () => {
        expect(attachmentFile.id).toBe('0F28A313-EEDB-413E-9D41-BED8213DCB95');
    });

    test("it should have a partNumber", () => {
        expect(attachmentFile.partNumber).toBe(82);
    });
    
    test("it should have a fragments collection", () => {
        expect(attachmentFile.fragments).not.toBeUndefined();
    });

    test("the fragments collection should be populated", () => {
        expect(attachmentFile.fragments.length).toBe(1);
    });

    test("all fragments should be the primary file itself", () => {
        expect(attachmentFile.fragments[0].id).toBe(attachmentFile.id);
    });

    test("all the fragment filenames should be collated", () => {
        expect(attachmentFile.fragments[0].filename).toEqual('857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7');
    });
});