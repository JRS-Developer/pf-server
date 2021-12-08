const app = require('./src/app')
const { conn } = require('./src/db')
const { port } = require('./src/lib/config')



conn.sync({ force: true }).then(() => {
  app.listen(port, () => {
    console.log(`The server is running on port ${port}`)
  })
})
