const main = require("../src/main");
const helper = require("../src/helper");
const pds_client = require("../src/pds_client");
jest.mock("../src/pds_client");
const ldap_spine_client = require("../src/ldap_spine_client");
jest.mock("../src/ldap_spine_client");

describe('When generating a request', () => {

    let event;
    const deduction_org_id = "DEF456";
    let result;
    const fake_patient_most_recent_practice_code = "XYZ987";
    const spyPDSClient = jest.spyOn( pds_client, 'update_patient_practice' );

    beforeAll(async () => {
        event = {
            patient_nhs_number: 12345,
        };

        pds_client.retrieve_most_recent_practice_code_for = function(nhsNumber) { 
            if (nhsNumber === event.patient_nhs_number) return fake_patient_most_recent_practice_code;
        };

        ldap_spine_client.does_sending_practice_support_gp2gp = function(arg) {
            if (arg === fake_patient_most_recent_practice_code) {
                return true;
            }
        }

        result = await main.handler(event);
    })

    test("It should update patient record on PDS with requesting practice info", async () => {
        expect(spyPDSClient).toHaveBeenCalledWith(deduction_org_id);
    })

    test("it should return the expected xml", async () => {
        let expected_xml = helper.get_ehr_extract(event.patient_nhs_number, 
                                                  fake_patient_most_recent_practice_code,
                                                  deduction_org_id);
        expect(result).toBe(expected_xml);
    });

});
