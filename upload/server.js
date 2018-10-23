const http = require('http')
const formidable = require('formidable')


const server = http.createServer(function(req, res) {
  switch(req.method) {
    case 'GET':
      show(req, res)
      break
    case 'POST':
      upload(req, res)
    break
  }

})

function show(req, res) {
  const html = ''
    + '<form method="post" action="/" enctype="multipart/form-data" >'
    +   '<input type="text" name="name" />'
    +   '<input type="file" name="file" />'
    +   '<input type="submit" value="wyslij do" />'
    + '</form>'
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Type', Buffer.byteLength(html))
  res.end(html)
}

function upload(req, res) {
  if(!isFormData(req)) {
    res.statusCode = 400
    res.end('dane wejsiowe nie dozwolonego typu')
    return
  }

  const form = new formidable.IncomingForm()

  form.on('field', (field, value) => {
    console.log(value)
    console.log(field)
  })

  form.on('file', (name, value) => {
    console.log(name)
    console.log(value)
  })

  form.on('end', () => {
    return 'Zakonczono przesylanie'
  })
  form.on('progress', (byteReceived, byteExeptet) => {
    let procent = Math.floor((byteReceived / byteExeptet) * 100)
    console.log(procent)
  })
  form.parse(req)
}

function isFormData(req) {
  const type = req.headers['content-type'] || ''
  return 0 === type.indexOf('multipart/form-data')
}

server.listen(3000)