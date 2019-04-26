const main = require("../src/main");

describe('When checking my tests work', () => {

    let result;

    beforeAll(async () => {
        result = await main.yabba_dabba();
    })

    test("it should yabba dabba do", async () => {
        expect(result).toBe('do');
    });
});