const { conn } = require('./db')

//Models
const {
  Action,
  Module,
  Role,
  User,
  Access,
  // Task,
  Classes,
  Materias,
  Schools,
  CicloElectivo,
  Matricula,
  TeachersMaterias,
} = require('./models')
//Datos
const { modules, actions } = require('./datos/modules-actions')
//Users
const { users } = require('./datos/users')
const { access } = require('./datos/access')
// const { tasks } = require('./datos/tasks')
const { classes } = require('./datos/classes')
const { materias } = require('./datos/materias')
const { roles } = require('./datos/roles')
const { schools } = require('./datos/schools')
const { matricula } = require('./datos/matriculas')
const { assignMaterias } = require('./datos/asignarmaterias')

conn.sync({ force: true }).then(async () => {
  await initialSchools()
  await initialActions()
  await initialModules()
  await initialRoles()
  await initialUsers()
  await initialAccess()
  await initialClasses()
  await initialMaterias()
  // await initialTasks()
  await initialCiclosLectivos()
  await intialMatriculas()
  await intialMateriasAsignadasAProfe()

  console.log('Cargado los datos default en la base de datos! :D')
  return

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
        Module.create({
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
        if (dt.id === '9c137ea3-5958-47c9-bd91-91766d322141') {
          //le asigno la action ver solo al modulo noticias!
          newModule.then(function (res) {
            res.addAction(actions[4].id)
          })
        }
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
    const escuelasAAgregar = classes.map((el) => el.school_id)
    const clasesAAgregar = classes.map((el) => {
      return { id: el.id, name: el.name }
    })
    const clasesCreadas = await Classes.bulkCreate(clasesAAgregar)
    clasesCreadas.forEach((clase, i) => clase.addSchools(escuelasAAgregar[i]))
    const otrasSucursales = [
      '5db18bbe-0e6c-434e-8977-523f22e9818c',
      '91f7918b-6337-41d6-ab95-1fe2c72c005c',
    ]
    clasesCreadas[0].addSchools(otrasSucursales)
    console.log('clases cargadas')
  }

  async function initialMaterias() {
    const classesId = classes.map((el) => el.id)
    const materiasCreadas = await Materias.bulkCreate(materias)
    materiasCreadas.forEach((mat) => mat.addClasses(classesId))
    console.log('Materias cargadas')
  }

  // async function initialTasks() {
  //   let $saveData = []
  //   tasks.map((dt) => {
  //     let $data = Task.create({
  //       id: dt.id,
  //       title: dt.title,
  //       description: dt.description,
  //       end_date: dt.end_date,
  //       class_id: dt.class_id,
  //       materia_id: dt.materia_id,
  //     })

  //     $saveData.push($data)
  //   })

  //   await Promise.all($saveData).then(() => {
  //     console.log('algunas tareas pre cargadas')
  //   })
  // }

  async function initialSchools() {
    await Schools.bulkCreate(schools)
    console.log('Escuelas cargadas')
  }

  async function initialCiclosLectivos() {
    await CicloElectivo.bulkCreate([
      {
        id: '8387a420-ae5f-425d-9a19-6fc689f75f0b',
        name: '2021',
        status: false,
      },
      { id: '0444e7eb-4aa2-4378-8287-cd93d55fa655', name: '2022' },
    ])
    console.log('Ciclos Lectivos Cargados')
  }

  async function intialMatriculas() {
    await Matricula.bulkCreate(matricula)
    console.log('matriculas cargadas')
  }

  async function intialMateriasAsignadasAProfe() {
    await TeachersMaterias.bulkCreate(assignMaterias)
    console.log('Materias asignadas a profesores')
  }
})
