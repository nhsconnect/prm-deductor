const primaryFileBuilder = require("../src/primaryFileBuilder");
const given = require("./given");

describe('When parsing a primary file', () => {
    let primaryFile;

    beforeAll(async () => {
        let content = given.primaryFileContent;
        primaryFile = await primaryFileBuilder.build(content);
    })

    test("it should contain the message completed element", async () => {
        expect(primaryFile.content).toContain('<RCMR_IN030000UK06');
    });

    test("it should contain the ehr extract element", async () => {
        expect(primaryFile.content).toContain('<EhrExtract');
    });

    test("it should contain a manifest element", async () => {
        expect(primaryFile.content).toContain("<eb:Manifest");
    });

    test("it should have a name", async () => {
        expect(primaryFile.name).toBe('Part_82_12073865.1555409597528');
    });

    test("it should have 6 files", async () => {
        expect(primaryFile.attachments.length).toBe(6);
    });
    
    test("it should have 4 large attachments in the file collection", async () => {
        let largeAttachments = primaryFile.attachments.filter(file => file.largeAttachment);
        expect(largeAttachments.length).toBe(4);
    });

    test("it should have 2 standard attachments in the file collection", async () => {
        let standardAttachments = primaryFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments.length).toBe(2);
    });
});