const events = require('events')
const net = require('net')

var channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}

channel.on('join', function(id, client) {
  this.clients[id] = function(senderId, message) {
    if(id != senderId) {
      this.clients[id].write(message)
    }
  }
  this.on('broadcast', this.subscriptions[id])
})
channel.on('leave', function(id) {
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast', id, id + "opuścił czat. \n")
})

const server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort
  client.on('connect', function() {
    channel.emit('join', id, client)
  })
  client.on('data', function(data) {
    data = data.toString()
    if(data == "shutdown\r\n") {
      channel.emit('shutdown')
    }
    channel.emit('broadcast', id, data)
  })
  client.on('close', function() {
    channel.emit('leave', id)
  })
})
server.listen(2222, function() {
  console.log('server w odpowiednich rękach portu 2222')
})