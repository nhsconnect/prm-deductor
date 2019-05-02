const given = require("./givenAlt");
const fragmentCollator = require("../src/fragmentCollator");

describe('When gathering fragments for large attachments', () => {
    let indexFile;

    beforeAll(async () => {
        let fragmentLocation = "/Users/christiantaylor/Downloads/84106041-3FD6-4A48-BEA4-2A1CBA2D2880";
        let largeAttachmentId = 'E5EE718C-2577-401B-AFC3-CB651FD3011F';
        indexFile = await fragmentCollator.getIndexFileForLargeAttachment(largeAttachmentId, fragmentLocation);
    })

    test("it should find the large attachment index file", async () => {
        expect(indexFile).toEqual("/Users/christiantaylor/Downloads/84106041-3FD6-4A48-BEA4-2A1CBA2D2880/0Zl8WQLw-ibKwJY6r4e9FA==");
    });

});