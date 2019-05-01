const given = require("./givenAlt");
const orchestrator = require("../src/orchestrator");

describe('When appending data to standard attachments', () => {
    let result;

    beforeAll(async () => {
        let masterFileContent = given.fragmentContent;

        result = await orchestrator.doSomething(masterFileContent);
    })

    test("it should return the number of files extracted", async () => {
        expect(result).toBe(2);
    });

});