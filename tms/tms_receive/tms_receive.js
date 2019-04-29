const http = require('http')

let server = http.createServer((req, res) => {
    res.statusCode = 202
    res.end();
  })

exports.server = server

exports.startServer = () => {
    server.listen(4003)
}
