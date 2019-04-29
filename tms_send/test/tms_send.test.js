const tms = require('../tms_send');

describe("When sending a message to the Spine server,", () => {
    test("we get a response", () => {
        return expect(tms.send()).resolves.toBe(202);
    })
})