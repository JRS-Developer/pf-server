const config = require('./lib/config')
//traemos express para poder usarlo
const app = require('./app')
const axios = require('axios')
//conectamos express a http para poder luego conectar al webSocket server
const http = require('http')
const server = http.createServer(app)

//conectamos el server con la webSocket
const { Server } = require('socket.io')
const { userInfo } = require('os')
const io = new Server(server, {
  cors: {
    origin: config.cors,
    methods: ['GET', 'POST'],
  },
})

const onlineUsers = []

//inicializamos socket.io
io.on('connection', (socket) => {
  console.log('Nueva conexion')
  socket.on('online', async (user) => {
    const userInfo = await axios.get(`${config.api}/matriculas/user/${user}`)

    console.log(userInfo)
  })

  socket.on('notification', async (data) => {
    const receivers = await axios.post(
      `${config.api}/matriculas/student/matricula`,
      data
    )

    console.log(receivers)
    //  receivers.forEach(user => {

    //  })
  })

  socket.on('disconnect', () => {
    console.log('Conexion terminada')
  })
})

module.exports = server
