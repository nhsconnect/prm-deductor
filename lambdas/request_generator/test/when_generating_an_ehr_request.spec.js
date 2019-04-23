const main = require("../src/main");
const message_builder = require("../src/message_builder");
const pds_client = require("../src/pds_client");
jest.mock("../src/pds_client");

describe('When generating a request', () => {

    let event;
    let result;

    const deduction_org_id = "DEF456";
    const fake_patient_most_recent_practice_code = "XYZ987";
    const spyPDSClient = jest.spyOn( pds_client, 'update_patient_practice' );

    beforeAll(async () => {
        event = {
            patient_nhs_number: 12345,
        };

        pds_client.retrieve_most_recent_practice_code_for = function(nhsNumber) { 
            if (nhsNumber === event.patient_nhs_number) return fake_patient_most_recent_practice_code;
        };

        result = await main.handler(event);
    })

    test("It should update patient record on PDS with requesting practice info", async () => {
        expect(spyPDSClient).toHaveBeenCalledWith(deduction_org_id);
    })

    test("it should return the expected xml", async () => {
        let expected_xml = message_builder.build_ehr_request(event.patient_nhs_number, 
                                                  fake_patient_most_recent_practice_code,
                                                  deduction_org_id);
        expect(result).toBe(expected_xml);
    });

});
