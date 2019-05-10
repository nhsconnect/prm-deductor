const given = require("./given");
const orchestrator = require("../src/orchestrator");
const streamerator = require('../src/streamerator');
jest.mock('../src/streamerator');

describe.skip('When extracting all files', () => {
    let result;

    beforeAll(async () => {
        jest.clearAllMocks();
        streamerator.createReadStream = () => {
            return {
                read: () => {},
                pipe: () => {},
                push: () => {}
            }
        };
        let primaryFileContent = given.primaryFileContent;

        result = await orchestrator.doSomething(primaryFileContent);
    })

    test("it should return the number of files extracted", async () => {
        expect(result).toBe(6);
    });

});