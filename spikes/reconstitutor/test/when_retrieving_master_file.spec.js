const main = require("../src/main");
const given = require("./given");

describe('When checking my tests work', () => {
    let fileContent;

    beforeAll(async () => {
        let content = given.fragmentContent;

        fileContent = await main.retrieve_master_file(content);
    })

    test("it should contain the message completed element", async () => {
        expect(fileContent.content).toContain('<RCMR_IN030000UK06');
    });

    test("it should contain the ehr extract element", async () => {
        expect(fileContent.content).toContain('<EhrExtract');
    });

    test("it should contain a manifest element", async () => {
        expect(fileContent.content).toContain("<eb:Manifest");
    });

    test("it should have a name", async () => {
        expect(fileContent.name).toBe('Part_82_12073865.1555409597528');
    });

});