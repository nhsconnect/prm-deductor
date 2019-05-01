const endpoint = require('./endpoint')

let server = endpoint.createServer({
    ca: process.env.CA,
    key: process.env.KEY,
    cert: process.env.CERT
})

server.startServer()