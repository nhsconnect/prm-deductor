const main = require("../src/main");
const helper = require("../src/helper");

describe('When generating a request', () => {

    let result;

    beforeAll(async () => {
        let event = {
            patient_nhs_number: 12345,
        };
        result = await main.handler(event);
    })

    test("it should return the expected xml", async () => {
        let expected_xml = helper.get_ehr_extract(12345, "XYZ987", "DEF456");
        expect(result).toBe(expected_xml);
    });

});
