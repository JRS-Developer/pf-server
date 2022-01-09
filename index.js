const app = require('./src/app')
const { conn } = require('./src/db')
const { port } = require('./src/lib/config')

conn.sync().then(() => {
  app.listen(port, async () => {
    console.log(`The server is running on port ${port}`)
  })
})
