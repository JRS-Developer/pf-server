const app = require('./src/app')
const { conn } = require('./src/db')
const { port } = require('./src/lib/config')

//Models
const { Action, Module } = require('./src/models');
//Datos
const { modules, actions } = require('./src/datos/modules-actions')

conn.sync({ force: true }).then(() => {
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
          id: dt.id,
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
    let arrayActionsIds = [actions[0].id, actions[1].id, actions[2].id];
    modules.map(dt => {
      if(dt.module_id === 0){
        let newModule = Module.create({
          //where: {
            id: dt.id,
            name: dt.name,
            url: dt.url,
            icon : dt.icon,
          //}
        })

        newModule.then( function(res){
          res.addActions(arrayActionsIds);
          $saveData.push(newModule)
        })
      }else{
        let newModule = Module.create({
          //where: {
            id: dt.id,
            name: dt.name,
            url: dt.url,
            icon : dt.icon,
            module_id: dt.module_id
          //}
        })

        newModule.then( function(res){
          res.addActions(arrayActionsIds);
          $saveData.push(newModule)
        })
      }

    })

    Promise.all($saveData)
      .then(res => {
        console.log("modules pre cargadas");
      });
  }

})
