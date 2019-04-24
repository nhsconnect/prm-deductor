const message_generator = require("../src/message_generator");
const helper = require("../src/message_builder");
const ldap_spine_client = require("../src/ldap_spine_client");
jest.mock("../src/ldap_spine_client");

describe('When generating a message', () => {

    let extract;
    let result;
    let contract_details;

    beforeAll(async () => {

        const destination_practice_code = "DEST456";
        extract = helper.build_ehr_request(12345, "AUTH123", destination_practice_code);

        contract_details = {
            nhsMhsEndPoint: "blah-abba",
            nhsMhsIsAuthenticated: "blach",
            nhsMhsPersistduration: "dd",
            nhsMhsRetries: "bjk",
            nhsMhsRetryInterval: "fdsf",
            nhsMhsSyncReplyMode: "JDH",

            nhsMhsAckRequested: "FKJD",
            nhsMhsDuplicateElimination: "KJBF",
            nhsMhsActor: "fhdf",
            nhsMhsCPAId: "dje"
        };

        ldap_spine_client.retrieve_message_contract_details_for_practice = function(practiceCode) { 
            if (practiceCode === destination_practice_code) return contract_details;
        };

        result = await message_generator.generate(extract);
    })

    xtest("it should return a message containing the EHR extract", async () => {
        expect(result).toContain(extract);
    });

    test("it should return a message containing the nhsMhsEndPoint", async () => {
        expect(result).toContain(contract_details.nhsMhsEndPoint);
    });

    test("it should return a message containing the nhsMhsIsAuthenticated", async () => {
        expect(result).toContain(contract_details.nhsMhsIsAuthenticated);
    });

    test("it should return a message containing the nhsMhsPersistduration", async () => {
        expect(result).toContain(contract_details.nhsMhsPersistduration);
    });
    
    test("it should return a message containing the nhsMhsRetries", async () => {
        expect(result).toContain(contract_details.nhsMhsRetries);
    });

    test("it should return a message containing the nhsMhsRetryInterval", async () => {
        expect(result).toContain(contract_details.nhsMhsRetryInterval);
    });

    test("it should return a message containing the nhsMhsSyncReplyMode", async () => {
        expect(result).toContain(contract_details.nhsMhsSyncReplyMode);
    });

    test("it should return a message containing the nhsMhsAckRequested", async () => {
        expect(result).toContain(contract_details.nhsMhsAckRequested);
    });

    test("it should return a message containing the nhsMhsDuplicateElimination", async () => {
        expect(result).toContain(contract_details.nhsMhsDuplicateElimination);
    });

    xtest("it should return a message containing the nhsMhsActor", async () => {
        expect(result).toContain(contract_details.nhsMhsActor);
    });

    xtest("it should return a message containing the nhsMhsCPAId", async () => {
        expect(result).toContain(contract_details.nhsMhsCPAId);
    });

});
