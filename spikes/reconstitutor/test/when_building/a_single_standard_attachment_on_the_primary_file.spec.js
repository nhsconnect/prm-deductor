const attachmentFragmentBuilder = require("../../src/building/attachmentFragmentBuilder");
const given = require("../given");
const fs = require('fs');
jest.mock('fs');

describe('When parsing a standard attachment stored on the primary file', () => {
    let attachment, fragments;

    beforeAll(() => {
        jest.clearAllMocks();
        
        attachment = { 
            id: 'Attachment2@e-mis.com/EMISWeb/GP2GP2.2A',
            name: '72FA3D52-D2B2-4197-87F4-238E9C6E4AA7_Customizing a Project Plan 2013.mpp',
            contentType: 'application/octet-stream',
            largeAttachment: false,
            fileLength: 72580,
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

    test("the fragments collection should be populated", () => {
        expect(fragments.length).toBe(1);
    });

    test("all fragments should be the primary file itself", () => {
        expect(fragments[0].id).toBe(attachment.id);
    });

    test("all the fragment filenames should be collated", () => {
        expect(fragments[0].filename).toEqual(attachment.name);
    });
});