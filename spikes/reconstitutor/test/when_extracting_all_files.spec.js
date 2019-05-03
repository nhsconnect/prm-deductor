const given = require("./given");
const orchestrator = require("../src/orchestrator");

describe('When extracting all files', () => {
    let result;

    beforeAll(async () => {
        let primaryFileContent = given.primaryFileContent;

        result = await orchestrator.doSomething(primaryFileContent);
    })

    test("it should return the number of files extracted", async () => {
        expect(result).toBe(6);
    });

});