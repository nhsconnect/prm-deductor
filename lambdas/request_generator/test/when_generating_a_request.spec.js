const main = require("../src/main");

describe('When generating a request', () => {

    let result;

    beforeAll(async () => {
        result = await main.handler({});
    })

    test("it should return something", async () => {
        expect(result).toBeTruthy();
    });

});
