const http = require('http')
const qs = require('querystring')
let items = []

const server = http.createServer(function(req, res) {
  if('/' == req.url) {
    switch(req.method) {
      case 'GET':
        show(res)
        break
      case 'DELETE':
        deleteItem(req, res)
        break
      case 'POST':
        add(req, res)
        break
      default:
        badRequest(res)
    }
  }
  else {
    notFound(res)
  }
})

function show(res) {
  const html = '<html><head><title>przykladowo lista rzeczy do zrobienia</title></head><body>'
    + '<h1>Lista rzeczy do zrobienia</h1>'
    + '<ul>'
    + items.map((item) => {
        return '<li>' + item + '</li>'
      }).join('')
    + '</ul>'
    + '<form method="post" action="/">'
    + '<input type="text" name="item" />'
    + '<input type="submit" value="Dodaj element"/>'
    + '<form method="post" action="/DELETE">'
    + '<input type="submit" value="Usun Element"/>'
    + '</form>'
    + '</form></body></html>'
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function notFound(res) {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain')
  res.end('Nie znaleziono zasobu')
}

function badRequest(res) {
  res.statusCode = 400
  res.setHeader('Content-Type', 'text/plain')
  res.end('Nieprawidlowe zadanie')
}

function add(req, res) {
  let body = ''
  req.setEncoding('utf8')
  req.on('data', (chunk) => { body += chunk})
  req.on('end', function() {
    let obj = qs.parse(body)
    items.push(obj.item)
    show(res)
  })
}

function deleteItem(req, res) {
  req.on('end', function(req, res) {
    let nr = items.length - 1
    items.splice(nr, 1)
    show(res)
  })
}

server.listen(3000)