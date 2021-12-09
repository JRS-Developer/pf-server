const app = require('./src/app')
const { conn } = require('./src/db')
const { port } = require('./src/lib/config')


//Models
const { Action, Module } = require('./src/models');
//Datos
const { modules, actions } = require('./src/datos/modules-actions')

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
  
  //return await conn.models.roles.bulkCreate(rolesPorDefault)

}


conn.sync({ force: false }).then(defaultRoles).then(() => {
  app.listen(port, () => {
    console.log(`The server is running on port ${port}`)

    initialActions();
    initialModules();

  })

  function initialActions(){
    let $saveData = [];
    actions.map(dt => {
      let $data = Action.findOrCreate({
        where: {
          name: dt.name,
          action_param: dt.action_param,
          onclick: dt.onclick,
          icon: dt.icon,
        }
      })

      $saveData.push($data)
    })

    Promise.all($saveData)
      .then(res => {
        console.log("acciones pre cargadas");
      });
  }

  function initialModules(){
    let $saveData = [];
    modules.map(dt => {
      let $data = Module.findOrCreate({
        where: {
          name: dt.name,
          url: dt.url,
          icon : dt.icon
        }
      })

      $saveData.push($data)
    })

    Promise.all($saveData)
      .then(res => {
        console.log("modules pre cargadas");
      });
  }

})
