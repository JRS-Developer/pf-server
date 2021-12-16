const app = require('./src/app')
const { conn } = require('./src/db')
const { port } = require('./src/lib/config')

//Models
const { Action, Module, User, Role, Access } = require('./src/models')
//Datos
const { modules, actions } = require('./src/datos/modules-actions')
//Users
const { users } = require('./src/datos/users')
const { access } = require("./src/datos/access")

const defaultRoles = async () => {
  const rolesPorDefault = [
    {
      id: 'b74ca8ab-025d-4998-8ed6-823c1b761379',
      name: 'sUser',
    },
    {
      id: '0760edbd-4bad-416d-be6f-b7c9bf5bcfcb',
      name: 'Admin',
    },
    {
      id: '00fb931a-96b4-492b-9425-7a1ebe9e2386',
      name: 'Profesor',
    },
    {
      id: '850d46ea-4e5a-4ac5-9106-9bf1fae8545f',
      name: 'Alumno',
    },
    {
      id: 'd09dd9bd-1eb2-48f6-af3f-e46f8cc9831f',
      name: 'Tutor',
    },
  ]

  await Role.bulkCreate(rolesPorDefault)
  console.log('Cargado los roles')
}

conn.sync({ force: false }).then(() => {
  app.listen(port,async () => {
    console.log(`The server is running on port ${port}`)
    //await initialActions()
    //await initialModules()
    //await initialUsers()
    //await defaultRoles()
    //await initialAccess()
  })

  async function initialActions() {
    let $saveData = []
    actions.map((dt) => {
      let $data = Action.create({
          id: dt.id,
          name: dt.name,
          action_param: dt.action_param,
          onclick: dt.onclick,
          icon: dt.icon,
      })

      $saveData.push($data)
    })

    await Promise.all($saveData).then(() => {
      console.log('acciones pre cargadas')
    })
  }

  async function initialModules() {
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

    await Promise.all($saveData).then(() => {
      console.log('modules pre cargadas')
    })
  }

  async function initialUsers() {
    let $saveData = []
    users.map((dt) => {
      let $data = User.create({
        id: dt.id,
        firstName: dt.firstName,
        lastName: dt.lastName,
        userName: dt.userName,
        email: dt.email,
        password: dt.password,
        birthdate: dt.birthdate,
        identification: dt.identification,
        country: dt.country,
      })

      $saveData.push($data)
    })

    await Promise.all($saveData).then(() => {
      console.log('Usuarios pre cargados')
    })
  }

  async function initialAccess() {
    let $saveData = []
    access.map((dt) => {
      let $data = Access.create({
        user_id: dt.user_id,
        module_id: dt.module_id,
        action_id: dt.action_id
      })

      $saveData.push($data)
    })

    await Promise.all($saveData).then(() => {
      console.log('Access pre cargadas')
    })
  }
})
