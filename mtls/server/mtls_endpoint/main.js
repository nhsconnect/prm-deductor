const endpoint = require('./endpoint')
const AWSXRay = require('aws-xray-sdk');
AWSXRay.config([AWSXRay.plugins.ECSPlugin]);

server = endpoint.createServer({
    ca: process.env.CA,
    key: process.env.KEY,
    cert: process.env.CERT,
    port: 4444
})

server.on('listening', () => {
    console.log("Listening on " + server.address().port)
})

server.startServer()