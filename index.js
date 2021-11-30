const express = require('express')

const app = express()

const http = require('http')

const {Server} = require('socket.io')

const server = http.createServer(app)

const io = new Server(server)

let messages = []

const PORT = process.env.PORT || 3000

let base64image = ""

app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
})

io.on('connection',(socket) => {
    console.log("a user connected")

    socket.on('image',(data) => {
        console.log(data)
        base64image = data
        io.sockets.emit('image',data)
    })

    socket.emit('oldimage',base64image)

    for(let message of messages)
        socket.emit('oldmessages',message)

    socket.on('message',(message) => {
        console.log(socket.username)
        messages.push(socket.username + ":" + message)

        io.sockets.emit('message',socket.username + ":" + message)
    })

    socket.on('username',(data) => {
        socket.username = data
        console.log(socket.username)
        socket.emit('username',socket.username)
    })

    socket.on('disconnect',() => {
        console.log('user disconnected')
    })
})

server.listen(PORT,() => {
    console.log("Server is listening on port 3000")
}) 