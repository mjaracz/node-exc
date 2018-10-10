const http = require('http');
const parse = require('url').parse;
const join = require('path').join;
const fs = require('fs');

const root = __dirname;

const server = http.createServer(function(req, res) {
  const url = parse(req.url);
  const path = join(root, url.pathname);
  const stream = fs.createReadStream(path);
  
  fs.stat(path, function(err, stat) {
    if(err) {
      if('ENOENT' == err.code) {
        res.statusCode = 404
        res.end('Nie znalezione')
      }
      else {
        res.statusCode = 500;
        res.end('Wewnetrzny blad serwera')
      }
    }
    else {
      res.setHeader('Content-Length', stat.size)
      const stream = fs.createReadStream(path)
      stream.pipe(res);
      server.on('error', function(err) {
        res.statusCode = 500;
        res.end('Wewnetrzny blad serwera')
      })
    }
  })
})

server.listen(3000);