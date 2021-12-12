const { Access, Module, User} = require('../models')
const {Sequelize, Op} = require("sequelize");
const {secret} = require("../lib/config");

//
const getAccess = async (req, res, next) => {
  try {

    const userId = res.locals.userId;

    //Obtenemos los módulos padres
    const fathers = await Access.findAll({
      where: {
        user_id: userId,
      },
      attributes: ['module_id'],
      include : [
        {
          model: Module,
          as : 'module',
          attributes: ['name', 'url', 'icon', ['module_id', 'father_id']],
          where: {
            module_id: null
          }
        }
      ]
    })

    // Obtenemos lo módulos hijos
    const children = await Access.findAll({
      where: {
        user_id: userId,
      },
      attributes: ['module_id'],
      include : [
        {
          model: Module,
          as : 'module',
          attributes: ['id', 'name', 'url', 'icon', 'module_id'],
          where: {
            module_id: {
              [Op.not]: null
            }
          }
        }
      ]
    })

    // Creamos un array con lo módulos padres e hijos
    let $modules = [];
    fathers.map( father => {
      let obj = {};
      obj.id = father.module_id;
      obj.name = father.module.name;
      obj.url = father.module.url;
      obj.icon = father.module.icon;

      let ob;
      let newArray = [];
      children.map( r => {
        if(r.module.module_id === father.module_id){
          ob = {
            id: r.module.id,
            name: r.module.name,
            url: r.module.url,
            icon: r.module.icon,
            father_id: r.module.module_id
          }

          return newArray.push(ob)
        }
      })

      //Creamos objetos con elementos únicos
      const setHijosUnicos = new Set(); // creamos pares de clave y array

      obj.sub_data = newArray.reduce((acc, elemento) => {
        const key = JSON.stringify(elemento);
        if (!setHijosUnicos.has(key)){
          setHijosUnicos.add(key, elemento)
          acc.push(elemento)
        }
        return acc;
      },[]);

      $modules.push(obj)
    })

    return res.json($modules)

  }catch (error) {
    next(error.message)
  }
}

const createAccess = async (req, res, next) => {
  try {
    const { user_id, module_id, action_id } =
      req.body
    // TODO: añadir validaciones de datos

    await Access.create({
      user_id,
      module_id,
      action_id
    })

    return res.json({ message: 'Access created successfully' })
  } catch (error) {
    next(error.message)
  }
}

module.exports = {
  getAccess,
  createAccess
}