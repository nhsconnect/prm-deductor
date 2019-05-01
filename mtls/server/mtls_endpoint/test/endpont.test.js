const tms = require('../endpoint')
const request = require('request-promise-native')
const fs = require('fs');
const path = require('path');

const CERT = fs.readFileSync(path.resolve(__dirname, "../tls/mth.crt"))
const CA = fs.readFileSync(path.resolve(__dirname, "../tls/trust.pem"))
const KEY = fs.readFileSync(path.resolve(__dirname, "../tls/mth.key"))

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
            uri: 'https://localhost:4444',
            resolveWithFullResponse: true,
            agentOptions: {
                ca: CA,
                key: KEY,
                cert: CERT
            }
        }
        return expect(request(options)).resolves.toHaveProperty('statusCode', 202)
    })
})