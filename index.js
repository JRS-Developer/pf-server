const app = require('./src/app')
const { conn } = require('./src/db')
const { port } = require('./src/lib/config')

//Models
const { Action, Module, User, Role } = require('./src/models')
//Datos
const { modules, actions } = require('./src/datos/modules-actions')
//Users
const { users } = require('./src/datos/users')

const defaultRoles = async () => {
  const rolesPorDefault = [
    {
      name: 'sUser',
    },
    {
      name: 'Admin',
    },
    {
      name: 'Profesor',
    },
    {
      name: 'Alumno',
    },
    {
      name: 'Tutor',
    },
  ]

  await Role.bulkCreate(rolesPorDefault)
  console.log('Cargado los roles')
}

conn
  .sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`The server is running on port ${port}`)
      initialActions()
      initialModules()
      initialUsers()
      defaultRoles()
    })

    function initialActions() {
      let $saveData = []
      actions.map((dt) => {
        let $data = Action.findOrCreate({
          where: {
            id: dt.id,
            name: dt.name,
            action_param: dt.action_param,
            onclick: dt.onclick,
            icon: dt.icon,
          },
        })

        $saveData.push($data)
      })

      Promise.all($saveData).then(() => {
        console.log('acciones pre cargadas')
      })
    }

    function initialModules() {
      let $saveData = []
      let arrayActionsIds = [actions[0].id, actions[1].id, actions[2].id]
      modules.map((dt) => {
        if (dt.module_id === 0) {
          let newModule = Module.create({
            id: dt.id,
            name: dt.name,
            url: dt.url,
            icon: dt.icon,
          })

          newModule.then(function (res) {
            res.addActions(arrayActionsIds)
            $saveData.push(newModule)
          })
        } else {
          let newModule = Module.create({
            id: dt.id,
            name: dt.name,
            url: dt.url,
            icon: dt.icon,
            module_id: dt.module_id,
          })

          newModule.then(function (res) {
            res.addActions(arrayActionsIds)
            $saveData.push(newModule)
          })
        }
      })

      Promise.all($saveData).then(() => {
        console.log('modules pre cargadas')
      })
    }

    function initialUsers() {
      let $saveData = []
      users.map((dt) => {
        let $data = User.findOrCreate({
          where: {
            firstName: dt.firstName,
            lastName: dt.lastName,
            userName: dt.userName,
            email: dt.email,
            password: dt.password,
            birthdate: dt.birthdate,
            identification: dt.identification,
            country: dt.country,
          },
        })

        $saveData.push($data)
      })

      Promise.all($saveData).then(() => {
        console.log('Usuarios pre cargados')
      })
    }
  })
