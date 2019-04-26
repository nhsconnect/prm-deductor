const main = require("../src/main");

describe('When checking my tests work', () => {
    let fileContent;

    beforeAll(async () => {
        fileContent = await main.retrieve_master_file();
    })

    test("it should contain the message completed element", async () => {
        expect(fileContent).toContain('<RCMR_IN030000UK06');
    });

    test("it should contain the ehr extract element", async () => {
        expect(fileContent).toContain('<EhrExtract');
    });
});