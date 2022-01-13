const config = require('./lib/config')
//traemos express para poder usarlo
const app = require('./app')
const axios = require('axios')
//conectamos express a http para poder luego conectar al webSocket server
const http = require('http')
const server = http.createServer(app)
const { Matricula, User }= require('./models')
//conectamos el server con la webSocket
const { Server } = require('socket.io')

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

    const userInfo = await Matricula.findOne({ where: { student_id: user } })

    userInfo.dataValues.socketId = socket.id

    onlineUsers.push(userInfo.dataValues)
    
    console.log(onlineUsers)
  })

  socket.on('notification', async (data) => {
    
    const students = await Matricula.findAll({
      where: {
        school_id: data.school_id,
        clase_id: data.clase_id,
        ciclo_lectivo_id: data.ciclo_lectivo_id,
      },
      attributes: ['id', 'student_id'],
      include: [
        {
          model: User,
          attributes: ['lastName', 'firstName', 'identification'],
        },
      ],
    })

    const receivers = onlineUsers.filter(user => {
      students.some(st => st.id === user.id)
    })

   console.log(receivers)

   receivers.forEach(user => io.to(user.socketId).emit('notification', data.message))
  //  receivers.forEach(user => {

  //  })

  })

  socket.on('disconnect', () => {
    onlineUsers.pop()
    console.log('Conexion terminada')
  })
})

module.exports = server
