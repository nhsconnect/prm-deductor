const endpoint = require('./endpoint')
const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-2'});

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
        // ClientContext: 'STRING_VALUE',
        InvocationType: Event,
        // LogType: None | Tail,
        // Payload: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
        // Qualifier: 'STRING_VALUE'
      };
      lambda.invoke(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
})

server.startServer()