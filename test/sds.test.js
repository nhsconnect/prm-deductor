const sds=require('../sds')
const ldap=require("./ldap")

describe("When retrieving message handling details", () => {
    beforeAll(async (done) => {
        ldap.server.on('listening', () => {
            done()
        })
        ldap.startServer()
    })

    afterAll(() => {
        ldap.stopServer()
    })

    test("the details are returned when exactly one entry matches", async (done) => {
        try {
            var result = await sds.getMessageHandlingDetails(ldap.server.url, "P83020")
            console.log(result)
            done()
        } catch (err) {
            console.log(err)
            done.fail(err)
        }
    })
})