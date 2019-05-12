const given = require("./given");
const orchestrator = require("../src/orchestrator");

describe.skip('When extracting all files in a folder', () => {
    let result;

    beforeAll(async () => {
        jest.clearAllMocks();

        result = await orchestrator.doSomething(primaryFileContent);
    })

    test("it should return the number of files extracted", async () => {
        expect(result).toBe(6);
    });

});