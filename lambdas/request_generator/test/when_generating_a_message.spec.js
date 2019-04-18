const message_generator = require("../src/message_generator");
const helper = require("../src/helper");

describe('When generating a message', () => {

    let extract;
    let result;
    let contract_details;

    beforeAll(async () => {
        extract = helper.build_ehr_extract(12345, "AUTH123", "DEST456");
        result = await message_generator.generate(extract);
    })

    test("it should return the expected xml", async () => {
        let expected_xml = helper.build_message(extract, contract_details);
        expect(result).toBe(expected_xml);
    });
});
