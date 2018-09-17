const socketio = require('socket.io')
let io

let guestNumber = 1
let nickNames = {}
let namesUsed = []
let currentRoom = {}

exports.listen = function (server) {
  io = socketio.listen(server)
  io.set('log level', 1)
  
  function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Gość' + guestNumber
    nickNames[socket.id] = name
    socket.emit('nameResult', {
      success: true,
      name: name
    })
    namesUsed.push(name)
    return guestNumber + 1
  }

  function joinRoom(socket, room) {
    socket.join(room)
    currentRoom[socket.id] = room
    socket.emit('joinResult', {room: room})
    socket.broadcast.to(room).emit('message', {
      text: nickNames[socket.id] + ' dolaczyl do pokoju ' + room + '.'
    })

    let usersInRoom = io.sockets.clients(room)
    if(usersInRoom.length > 1) {
      let usersInRoomSummary = 'Lista użytkowników pokoju ' + room + ': '
      for (let index in usersInRoom) {
        let userSocketId = usersInRoom.index.id
        if(userSocketId != socket.id) {
          if(index > 0) usersInRoomSummary += ', '
          usersInRoomSummary += nickNames.userSocketId
        }
      }
      usersInRoomSummary += '.'
      socket.emit('message', {text: usersInRoomSummary})
    }
  }
  
  function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function() {
      if(name.indexOf('Gość') === 0) {
        socket.emit('nameResult', {
          success: false,
          message: 'Nazwa użytkownika nie może rozpoczynać się od słowa "Gość".'
        })
      }
      else {
        if (namesUsed.indexOf(name) === -1) {
          let previousName = nickNames[socket.id]
          let previousNameIndex = namesUsed.indexOf(previousName)
          namesUsed.push(name)
          nickNames[socket.id] = name
          delete namesUsed[previousNameIndex]
          socket.emit('nameResult', {
            success: true,
            name: name
          })

          socket.broadcast.to(currentRoom[socket.id]).emit('wiadomosc', {
            tekst: previousName + 'zmienil nazwe na ' + name + '.'
          })
        }
        else {
          socket.emit('nameResult', {
            success: false,
            message: 'Ta nazwa jest uzywana przez innego uzytkowniak'
          })
        }
      }
    })
  }

 function handleMessageBroadcasting(socket) {
  socket.on('message', function(message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    })
  })
 }

  function handleRoomJoining(socket) {
    socket.on('join', function(room) {
      socket.leave(currentRoom[socket.id])
      joinRoom(socket, room.newRoom)
    })
  }

  function handleClientDisconnection(socket) {
    socket.on('disconnect', () => {
      let nameIndex = namesUsed.indexOf(nickNames[socket.id])
      delete namesUsed[nameIndex]
      delete nickNames[socket.id]
    })
  }
  
  
  
  io.sockets.on('connection', function (socket) {
    
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)
    joinRoom(socket, 'Lobby')
    
    handleMessageBroadcasting(socket, nickNames)
    handleNameChangeAttempts(socket, nickNames, namesUsed)
    handleRoomJoining(socket)
    
    socket.on('rooms', function() {
      socket.emit('rooms', io.sockets.manager.rooms)
    })
    
    handleClientDisconnection(socket, nickNames, namesUsed)
  })
}