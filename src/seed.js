const { conn } = require('./db')

//Models
const {
  Action,
  Module,
  Role,
  User,
  Access,
  Task,
  Classes,
  Materias,
  Schools,
  CicloElectivo,
  Matricula,
} = require('./models')
//Datos
const { modules, actions } = require('./datos/modules-actions')
//Users
const { users } = require('./datos/users')
const { access } = require('./datos/access')
const { tasks } = require('./datos/tasks')
const { classes } = require('./datos/classes')
const { materias } = require('./datos/materias')
const { roles } = require('./datos/roles')
const { schools } = require('./datos/schools')
const { matricula } = require('./datos/matriculas')

conn.sync({ force: true }).then(async () => {
  await initialSchools()
  await initialActions()
  await initialModules()
  await initialRoles()
  await initialUsers()
  await initialAccess()
  await initialClasses()
  await initialMaterias()
  await initialTasks()
  await initialCiclosLectivos()
  await intialMatriculas()
  console.log('Cargado los datos default en la base de datos! :D')

  async function initialRoles() {
    await Role.bulkCreate(roles)
    console.log('Cargado los roles')
  }

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
        roleId: dt.roleId,
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
        action_id: dt.action_id,
      })

      $saveData.push($data)
    })

    await Promise.all($saveData).then(() => {
      console.log('Access pre cargadas')
    })
  }

  async function initialClasses() {
    await Classes.bulkCreate(classes)
    console.log('clases cargadas')
  }

  async function initialMaterias() {
    const classesId = classes.map((el) => el.id)
    const materiasCreadas = await Materias.bulkCreate(materias)
    materiasCreadas.forEach((mat) => mat.addClasses(classesId))
    console.log('Materias cargadas')
  }

  async function initialTasks() {
    let $saveData = []
    tasks.map((dt) => {
      let $data = Task.create({
        id: dt.id,
        title: dt.title,
        description: dt.description,
        end_date: dt.end_date,
        class_id: dt.class_id,
        materia_id: dt.materia_id,
      })

      $saveData.push($data)
    })

    await Promise.all($saveData).then(() => {
      console.log('algunas tareas pre cargadas')
    })
  }
  async function initialSchools() {
    await Schools.bulkCreate(schools)
    console.log('Escuelas cargadas')
  }

  async function initialCiclosLectivos() {
    await CicloElectivo.bulkCreate([
      { id: '8387a420-ae5f-425d-9a19-6fc689f75f0b', name: '2021', status: false },
      { id: '0444e7eb-4aa2-4378-8287-cd93d55fa655', name: '2022' },
    ])
    console.log('Ciclos Lectivos Cargados')
  }

  async function intialMatriculas() {
    await Matricula.bulkCreate(matricula)
    console.log('matriculas cargadas')
  }
})
