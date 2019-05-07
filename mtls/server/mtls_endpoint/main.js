const endpoint = require('./endpoint')
const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-2'});
const lambda = new AWS.Lambda();

let server = endpoint.createServer({
    ca: process.env.CA,
    key: process.env.KEY,
    cert: process.env.CERT,
    port: 4444
})

server.on('listening', () => {
    console.log("Listening on " + server.address().port)

    var params = {
        FunctionName: 'mtls-test-dev',
        InvocationType: 'Event',
    };
    lambda.invoke(params, function(err, data) {
        if (err) {
            console.log(err, err.stack)
        }
    });
})

server.startServer()