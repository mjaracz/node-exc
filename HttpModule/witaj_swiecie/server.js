const http = require('http')
const server = http.createServer(function(req, res) {
  res.end('Witaj swiecie')
})
server.listen(3000)