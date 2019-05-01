const message_generator = require("../src/message_generator");
const helper = require("../src/message_builder");
const ldap_spine_client = require("../src/ldap_spine_client");
jest.mock("../src/ldap_spine_client");

describe('When generating a message', () => {

    let request;
    let result;
    let contract_details;

    beforeAll(async () => {

        const destination_practice_code = "DEST456";
        request = helper.build_ehr_request(12345, "AUTH123", destination_practice_code);

        contract_details = {
            nhsMhsAckRequested: "FKJD",
            nhsMhsDuplicateElimination: "KJBF",
            nhsMhsActor: "fhdf",
            nhsMhsCPAId: "dje"
        };

        ldap_spine_client.retrieve_message_contract_details_for_practice = function(practiceCode) { 
            if (practiceCode === destination_practice_code) return contract_details;
        };

        result = await message_generator.generate(request);
    })

    test("it should return a message containing the nhsMhsAckRequested", async () => {
        expect(result.soapMessage).toContain(contract_details.nhsMhsAckRequested);
    });

    test("it should return a message containing the nhsMhsDuplicateElimination", async () => {
        expect(result.soapMessage).toContain(contract_details.nhsMhsDuplicateElimination);
    });

    test("it should return a message containing the nhsMhsActor", async () => {
        expect(result.soapMessage).toContain(contract_details.nhsMhsActor);
    });

    test("it should return a message containing the nhsMhsCPAId", async () => {
        expect(result.soapMessage).toContain(contract_details.nhsMhsCPAId);
    });

    test("it should return a message containing the ehr request", async () => {
        expect(result.payload).toContain(request);
    });

});
