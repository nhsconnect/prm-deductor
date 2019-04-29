const tms = require('../tms_receive')
const request = require('request-promise-native')

describe("When receiving a message from the Spine server,", () => {
    beforeAll(async (done) => {
        tms.server.on('listening', () => {
            done()
        })
        tms.startServer()
    })

    afterAll(() => {
        tms.server.close()
    })

    test("we response with a 202", () => {
        let options = {
            method : 'POST',
            uri: 'http://localhost:4003',
            resolveWithFullResponse: true
        }
        return expect(request(options)).resolves.toHaveProperty('statusCode', 202)
    })
})