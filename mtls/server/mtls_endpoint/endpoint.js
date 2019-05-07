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
        InvocationType: 'Event',
      };
      lambda.invoke(params, function(err, data) {
        if (err) {
          console.log(err, err.stack)
        }
      });
  }

  return server
}