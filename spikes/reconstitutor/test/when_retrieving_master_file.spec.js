const main = require("../src/main");
const given = require("./given");

describe('When retrieving master file', () => {
    let fragment;

    beforeAll(async () => {
        let content = given.fragmentContent;
        fragment = await main.retrieve_master_file(content);
    })

    test("it should contain the message completed element", async () => {
        expect(fragment.content).toContain('<RCMR_IN030000UK06');
    });

    test("it should contain the ehr extract element", async () => {
        expect(fragment.content).toContain('<EhrExtract');
    });

    test("it should contain a manifest element", async () => {
        expect(fragment.content).toContain("<eb:Manifest");
    });

    test("it should have a name", async () => {
        expect(fragment.name).toBe('Part_82_12073865.1555409597528');
    });

    test("it should have 6 files", async () => {
        expect(fragment.files.length).toBe(6);
    });

    test("it should have 2 standard attachments in the file collection", async () => {
        expect(fragment.files.filter(file => file.largeAttachment === false).length).toBe(2);
    });
    
    test("it should have 4 large attachments in the file collection", async () => {
        expect(fragment.files.filter(file => file.largeAttachment).length).toBe(4);
    });
});