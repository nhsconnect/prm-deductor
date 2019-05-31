const attachmentFragmentBuilder = require("../../src/building/attachmentFragmentBuilder");
const fs = require('fs');
jest.mock('fs');

describe('When parsing an attachment and the file is not present', () => {
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

        fs.existsSync = (path) => {
            if (path === attachment.fullFilePath) {
                return false;
            }
            return true;
        }

        fragments = attachmentFragmentBuilder.buildFragmentsFor(attachment);
    })
    
    test("it should have a fragments collection", () => {
        expect(fragments).not.toBeUndefined();
    });

    test("the fragments collection should be empty", () => {
        expect(fragments.length).toBe(0);
    });
});