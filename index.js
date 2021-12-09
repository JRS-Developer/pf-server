const app = require('./src/app')
const { conn } = require('./src/db')
const { port } = require('./src/lib/config')


const defaultRoles = async () => {
  rolesPorDefault = [
    {
      name: "sUser",
    },
    {
      name: "Admin",
    },
    {
      name: "Profesor",
    },
    {
      name: "Alumno",
    },
    {
      name: "Tutor",
    }
  ]
  
  return await conn.models.roles.bulkCreate(rolesPorDefault)

}


conn.sync({ force: true }).then(defaultRoles).then(() => {
  app.listen(port, () => {
    console.log(`The server is running on port ${port}`)
  })
})
