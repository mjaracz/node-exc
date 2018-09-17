const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')

let cache = {}

function send404(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'})
  res.write('Błąd 404: plik nie został znaleziony.')
  res.end()
}
function sendFile(res, filePath, fileContents) {
  res.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  )
  res.end(fileContents)
}
function serveStatic(res, cache, absPath) {
  if(cache[absPath]) {
    sendFile(res, absPath, cache[absPath])
  }
  else {
    fs.exists(absPath, function(exists) {
      if(exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(res)
          }
          else {
            cache[absPath] = data
            sendFile(res, absPath, data)
          }
        })
      }
      else {
        send404(res)
      }
    })
  }
}

const server = http.createServer(function(req, res) {
  let filePath = false
  
  if (req.url == '/') {
    filePath = 'public/index.html'
  }
  else {
    filePath = 'public' + req.url
  }
  
  const absPath = './' + filePath
  serveStatic(res, cache, absPath)
})

server.listen(2555, function() {
  console.log("Serwer w odpowiednich rękach portu TCP/IP 2555")
})


const chatServer = require('./lib/chat_server')
chatServer.listen(server)