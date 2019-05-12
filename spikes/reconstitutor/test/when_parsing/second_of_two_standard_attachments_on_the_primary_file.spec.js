const attachmentFragmentBuilder = require("../../src/parsers/attachmentFragmentBuilder");
const given = require("../given");
const fs = require('fs');
jest.mock('fs');

describe('When parsing the second of two standard attachments stored on the primary file', () => {
    let attachment, fragments;

    beforeAll(() => {
        jest.clearAllMocks();

        attachment = { 
            id: 'Attachment2@e-mis.com/EMISWeb/GP2GP2.2A',
            name: '857419DE-7512-4619-A567-067CF9959EF1_EmisWeb.Hl7',
            fullFilePath: 'parentFolder/0F28A313-EEDB-413E-9D41-BED8213DCB95'
        };

        fs.readFileSync = (filePath) => { 
            if (filePath === attachment.fullFilePath) {
                return given.primaryFileContentWithTwoStandardAttachments;
            }
            return '';
        };

        fragments = attachmentFragmentBuilder.buildFragmentsFor(attachment); 
    })
    
    test("it should have a fragments collection", () => {
        expect(fragments).not.toBeUndefined();
    });

    test("the fragments collection should have a single item", () => {
        expect(fragments.length).toBe(1);
    });

    test("the fragment should have the Id of the attachment part", () => {
        expect(fragments[0].id).toBe(attachment.id);
    });

    test("the fragment filename should be the original file", () => {
        expect(fragments[0].filename).toEqual(attachment.name);
    });

    test("the fragment file path should be the primary file", () => {
        expect(fragments[0].fullFilePath).toEqual(attachment.fullFilePath);
    });
});