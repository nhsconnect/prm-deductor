const endpoint = require('../endpoint')
const request = require('request-promise-native')
const fs = require('fs');
const path = require('path');
const getPort = require('get-port')

const CA = fs.readFileSync(path.resolve(__dirname, "tls/trust.pem"))
const SERVER_CERT = fs.readFileSync(path.resolve(__dirname, "tls/server.crt"))
const SERVER_KEY = fs.readFileSync(path.resolve(__dirname, "tls/server.key"))
const CLIENT_CERT = fs.readFileSync(path.resolve(__dirname, "tls/client.crt"))
const CLIENT_KEY = fs.readFileSync(path.resolve(__dirname, "tls/client.key"))

describe("When receiving a message from the Spine server,", () => {
    let server

    beforeAll(async (done) => {
        let port = await getPort()

        server = endpoint.createServer({
            ca: CA,
            cert: SERVER_CERT,
            key: SERVER_KEY,
            port: port,
            invoke: () => {
                return Promise.resolve()
            }
        })
        server.on('listening', () => {
            console.log("Listening on " + server.address().port)
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
            uri: 'https://localhost:' + server.address().port,
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