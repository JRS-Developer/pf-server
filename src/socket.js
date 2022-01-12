const config = require('./lib/config')
//traemos express para poder usarlo
const app = require('./app')
//conectamos express a http para poder luego conectar al webSocket server
const http = require('http')
const server = http.createServer(app)

//conectamos el server con la webSocket
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: config.cors,
    methods: ['GET', 'POST'],
  },
})

//inicializamos socket.io
io.on('connection', (socket) => {
  console.log('Nueva conexion')
  socket.on('disconnect', () => {
    console.log('Conexion terminada')
  })
})

module.exports = server
