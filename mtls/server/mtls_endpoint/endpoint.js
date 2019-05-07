const http = require('https')
const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-2'});
const lambda = new AWS.Lambda();

exports.createServer = (options) => {
  options.requestCert = true

  let server = http.createServer(options, (req, res) => {
    res.statusCode = 202
    console.log(req.headers)
    res.end();
  })

  server.startServer = () => {
    server.listen(options.port)

    var params = {
        FunctionName: 'mtls-test-dev',
        // ClientContext: 'STRING_VALUE',
        InvocationType: 'Event',
        // LogType: None | Tail,
        // Payload: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
        // Qualifier: 'STRING_VALUE'
      };
      lambda.invoke(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
  }

  return server
}