const main = require("../src/main");

describe('When checking my tests work', () => {
    let fileContent;

    beforeAll(async () => {
        fileContent = await main.retrieve_master_file();
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
        expect(fileContent.name).toBe('_Part_82_12073865.1555409597528');
    });
});