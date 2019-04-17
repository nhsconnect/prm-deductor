const main = require("../src/main");
const helper = require("../src/helper");
const pds_client = require("../src/pds_client");
jest.mock("../src/pds_client");

describe('When generating a request', () => {

    let event;
    let result;
    const fake_patient_most_recent_practice_code = "XYZ987";

    beforeAll(async () => {
        event = {
            patient_nhs_number: 12345,
        };
        pds_client.retrieve_most_recent_practice_code_for = function(nhsNumber) { 
            if (nhsNumber === event.patient_nhs_number) return fake_patient_most_recent_practice_code;
        };
        result = await main.handler(event);
    })

    test("it should return the expected xml", async () => {
        let expected_xml = helper.get_ehr_extract(event.patient_nhs_number, 
                                                  fake_patient_most_recent_practice_code,
                                                  "DEF456");
        expect(result).toBe(expected_xml);
    });

});
