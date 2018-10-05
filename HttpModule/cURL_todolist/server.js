const http = require('http')
const url = require('url')
let items = []

const server = http.createServer(function(req, res) {
  switch (req.method) {
    case 'POST':
      let item = ''
      req.setEncoding('utf8')
      req.on('data', function(chunk) {
        item += chunk
      })
      req.on('end', function() {
        items.push(item)
        res.end('OK\n')
      })
      break;
    case 'GET':
      
      const body = items.map(function(item, index) {
        return index + ') ' + item;
      }).join('\n')
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
      res.end(body +'\nOK\n')

      break;
    case 'DELETE':

      const path = url.parse(req.url).pathname
      const i = parseInt(path.slice(1), 10)

      if (isNaN(i)) {
        res.statusCode = 400
        res.end('Nieprawidlowy identifikator elementu')
      }
      else if(!items[i]) {
        res.statusCode = 404
        res.end('Element nie zostal znaleziony')
      }
      else {
        items.splice(i, 1)
        res.end('OK\n')
      }
      break;
    case 'PUT':
      let url = url.parse(req.url)
      req.setEncoding('utf8')
      req.on('data', function(chunk) {
        url += chunk
      }) 
      res.end(url)
      break;
  }
})
server.listen(3000)