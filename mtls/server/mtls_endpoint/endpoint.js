const http = require('https')

exports.createServer = (options) => {
  options.requestCert = true

  let server = http.createServer(options, (req, res) => {
    res.statusCode = 202
    console.log(req.headers)
    res.end();
  })

  server.startServer = () => {
    server.listen(4444)
  }

  return server
}