const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
AWS.config.update({ region: 'eu-west-2' });
const http = AWSXRay.captureHTTPs(require('https'))
const express = require('express');
const lambda = new AWS.Lambda();

const app = express();

app.use(AWSXRay.express.openSegment('mtls_endpoint'));

app.post("/", (req, res) => {
  console.log(req.headers)

  const params = {
    FunctionName: 'mtls-test-dev',
    InvocationType: 'Event',
  };
  
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
})

app.use(AWSXRay.express.closeSegment());

exports.createServer = (options) => {
  options.requestCert = true

  let server = http.createServer(options, app)

  server.startServer = () => {
    server.listen(options.port)
  }

  return server
}