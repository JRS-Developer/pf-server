const { conn } = require('./src/db')
const { port } = require('./src/lib/config')
const server = require('./src/socket')

conn.sync().then(() => {
  server.listen(port, async () => {
    console.log(`The server is running on port ${port}`)
  })
})
