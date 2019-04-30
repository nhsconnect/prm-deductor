const http = require('https')
const fs = require('fs');
const path = require('path');

const options = {
    key: fs.readFileSync(path.resolve(__dirname, "../tls/test.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "../tls/test.crt")),
    requestCert: true,
    ca: fs.readFileSync(path.resolve(__dirname, "../tls/trust.pem"))
  };

let server = http.createServer(options, (req, res) => {
    res.statusCode = 202
    console.log(req.headers)
    res.end();
  })

exports.server = server

exports.startServer = () => {
    server.listen(4444)
}
