const given = require("./givenAlt");
const fragmentCollator = require("../src/fragmentCollator");
const findInFiles = require('find-in-files');
jest.mock('find-in-files');
const fs = require('fs');
jest.mock('fs');

describe.skip('When gathering fragments for large attachments', () => {
    let fragments;
    
    beforeAll(async () => {
        jest.clearAllMocks();
        fs.readFileSync = () => { return given.fragmentManifestContent; };
        findInFiles.find = retrieveFileFromTestArray;
        
        let fragmentLocation = "/Users/christiantaylor/Downloads/sandbox";
        let largeAttachmentId = 'E5EE718C-2577-401B-AFC3-CB651FD3011F';
        
        fragments = await fragmentCollator.getAllFragmentsForLargeAttachment(largeAttachmentId, fragmentLocation);
    })
    
    test("it should return 3 items", async () => {
        expect(fragments.length).toBe(3);
    });

    test("it should find all the fragment file paths", async () => {
        largeAttachmentFragmentFiles.forEach(fragment => {
            expect(fragments).toContainEqual({
                fullFilePath: fragment.fullFilePath
            })
        });
    });
    
    async function retrieveFileFromTestArray(searchTerm, folderPath) {
        return new Promise((resolve, reject) => { 
            let foundItem = largeAttachmentFragmentFiles.find(item => item.messageId === searchTerm);
            let result = foundItem ? JSON.parse(`{ "${foundItem.fullFilePath}": { } }`) : {};
            resolve(result);
        })
    }

    let largeAttachmentFragmentFiles = [{
        partName: 'Part_95_4989111.1555409626562',
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/0Zl8WQLw-ibKwJY6r4e9FA==",
        messageId: "<message-id>E5EE718C-2577-401B-AFC3-CB651FD3011F</message-id>"
    },
    {
        partName: 'Part_96_24463764.1555409629418',
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/hQzneCPeb2-WCsSXOhER5g==",
        messageId: "<message-id>B48B8DC1-3C90-4817-8186-E2BA3B16E2EE</message-id>"
    },
    {
        partName: 'Part_100_18047280.1555409633496',
        fullFilePath: "/Users/christiantaylor/Downloads/sandbox/gYQPLrMwNz2syD+HKBdTrQ==",
        messageId: "<message-id>02D052E4-F8CC-4D2D-832A-E8F1EBB5F064</message-id>"
    }];
});