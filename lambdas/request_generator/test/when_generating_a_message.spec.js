const message_generator = require("../src/message_generator");
const helper = require("../src/helper");
const ldap_spine_client = require("../src/ldap_spine_client");
jest.mock("../src/ldap_spine_client");

describe('When generating a message', () => {

    let extract;
    let result;
    let contract_details;

    beforeAll(async () => {

        const destination_practice_code = "DEST456";
        extract = helper.build_ehr_extract(12345, "AUTH123", destination_practice_code);

        contract_details = {
            nhsMhsEndPoint: "blah-abba"
        };

        ldap_spine_client.retrieve_message_contract_details_for_practice = function(practiceCode) { 
            if (practiceCode === destination_practice_code) return contract_details;
        };

        result = await message_generator.generate(extract);
    })

    test("it should return a message containing the EHR extract", async () => {
        expect(result).toContain(extract);
    });

    test("it should return a message containing the nhsMhsEndPoint", async () => {
        expect(result).toContain(contract_details.nhsMhsEndPoint);
    });
});
