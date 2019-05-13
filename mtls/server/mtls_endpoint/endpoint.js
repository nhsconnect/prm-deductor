const http = require('https')
const AWS = require('aws-sdk')
AWS.config.update({ region: 'eu-west-2' });
const lambda = new AWS.Lambda();

const params = {
  FunctionName: 'mtls-test-dev',
  InvocationType: 'Event',
};

let handler = function(req, res) {
  console.log(req.headers)

  lambda.invoke(params).promise()
    .then(() => {
      res.statusCode = 202
      console.log("Succeeded at calling lambda")
      res.end();
    })
    .catch(err => {
      res.statusCode = 503
      console.log(err)  
      res.end();
    })
}

exports.createServer = (options) => {
  options.requestCert = true

  let server = http.createServer(options, handler)

  server.startServer = () => {
    server.listen(options.port)
  }

  return server
}