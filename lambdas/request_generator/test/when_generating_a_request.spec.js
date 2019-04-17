const main = require("../src/main");
const helper = require("../src/helper");

describe('When generating a request', () => {

    let result;

    beforeAll(async () => {
        result = await main.handler({});
    })

    test("it should return the expected xml", async () => {
        let expected_xml = helper.get_ehr_extract(12345, "ABC123", "DEF456");
        expect(result).toBe(expected_xml);
    });

});
