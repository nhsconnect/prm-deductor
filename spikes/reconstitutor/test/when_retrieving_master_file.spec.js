const masterFileBuilder = require("../src/masterFileBuilder");
const given = require("./given");

describe('When retrieving master file', () => {
    let masterFile;

    beforeAll(async () => {
        let content = given.fragmentContent;
        masterFile = await masterFileBuilder.build(content);
    })

    test("it should contain the message completed element", async () => {
        expect(masterFile.content).toContain('<RCMR_IN030000UK06');
    });

    test("it should contain the ehr extract element", async () => {
        expect(masterFile.content).toContain('<EhrExtract');
    });

    test("it should contain a manifest element", async () => {
        expect(masterFile.content).toContain("<eb:Manifest");
    });

    test("it should have a name", async () => {
        expect(masterFile.name).toBe('Part_82_12073865.1555409597528');
    });

    test("it should have 6 files", async () => {
        expect(masterFile.attachments.length).toBe(6);
    });
    
    test("it should have 4 large attachments in the file collection", async () => {
        let largeAttachments = masterFile.attachments.filter(file => file.largeAttachment);
        expect(largeAttachments.length).toBe(4);
    });

    test("it should have 2 standard attachments in the file collection", async () => {
        let standardAttachments = masterFile.attachments.filter(file => file.largeAttachment === false);
        expect(standardAttachments.length).toBe(2);
    });
});