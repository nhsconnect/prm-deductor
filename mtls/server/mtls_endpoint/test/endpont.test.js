const endpoint = require('../endpoint')
const request = require('request-promise-native')
const fs = require('fs');
const path = require('path');

const CA = fs.readFileSync(path.resolve(__dirname, "tls/trust.pem"))
const SERVER_CERT = fs.readFileSync(path.resolve(__dirname, "tls/server.crt"))
const SERVER_KEY = fs.readFileSync(path.resolve(__dirname, "tls/server.key"))
const CLIENT_CERT = fs.readFileSync(path.resolve(__dirname, "tls/client.crt"))
const CLIENT_KEY = fs.readFileSync(path.resolve(__dirname, "tls/client.key"))

describe("When receiving a message from the Spine server,", () => {
    let server

    beforeAll(async (done) => {
        server = endpoint.createServer({
            ca: CA,
            cert: SERVER_CERT,
            key: SERVER_KEY
        })
        server.on('listening', () => {
            done()
        })
        server.startServer()
    })

    afterAll(() => {
        server.close()
    })

    test("we response with a 202", () => {
        let options = {
            method : 'POST',
            uri: 'https://localhost:4444',
            resolveWithFullResponse: true,
            agentOptions: {
                ca: CA,
                key: CLIENT_KEY,
                cert: CLIENT_CERT
            }
        }
        return expect(request(options)).resolves.toHaveProperty('statusCode', 202)
    })
})