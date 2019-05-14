const endpoint = require('./endpoint');
const AWSXRay = require('aws-xray-sdk');
AWSXRay.config([AWSXRay.plugins.ECSPlugin]);
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
AWS.config.update({ region: 'eu-west-2' });
const lambda = new AWS.Lambda();

server = endpoint.createServer({
    ca: process.env.CA,
    key: process.env.KEY,
    cert: process.env.CERT,
    invoke: () => {
        const params = {
            FunctionName: process.env.LAMBDA,
            InvocationType: 'Event',
          };
          
          return lambda.invoke(params).promise()                
    },
    port: 4444
});

server.on('listening', () => {
    console.log("Listening on " + server.address().port)
});

server.startServer();