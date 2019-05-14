const AWSXRay = require('aws-xray-sdk');
const http = AWSXRay.captureHTTPs(require('https'));
const express = require('express');

const app = express();

let invoke;

app.use(AWSXRay.express.openSegment('mtls_endpoint'));

app.post("/", (req, res) => {
  console.log(req.headers);

  invoke()
    .then(() => {
      res.statusCode = 202;
      console.log("Succeeded at calling lambda");
      res.end();
    })
    .catch(err => {
      res.statusCode = 503;
      console.log(err);
      res.end();
    })
});

app.use(AWSXRay.express.closeSegment());

exports.createServer = (options) => {
  invoke = options.invoke;

  options.requestCert = true;

  let server = http.createServer(options, app);

  server.startServer = () => {
    server.listen(options.port)
  };

  return server
};