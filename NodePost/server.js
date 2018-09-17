const http = require('http')
const fs = require('fs')

const server = http.createServer(function(req, res) {
  getTitles(res)
}).listen(8000, "127.0.0.1")

function getTitles(res) {
  fs.readFile('./titles.JSON', function(err, data) {
    if(err) return hadProblem(err, res)
    var titles = JSON.parse(data.toString(), res)
    getTemplate(titles, res)
  });
}

function getTemplate(titles, res) {
  fs.readFile('./template.html', function(err, data) {
    if(err) return hadProblem(err, res)
    formatHTML(titles, data.toString(), res)
  });
}

function formatHTML(titles, template, res) {
  const html = template.replace('%', titles.join('</li><li>'))
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(html)
}

function hadProblem(err, res) {
  console.error(err, res)
  res.end('Błąd serwera')
}