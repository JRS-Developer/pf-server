const { Access, Module, Action } = require('../models')
const { Sequelize, Op, QueryTypes } = require('sequelize')
const { secret } = require('../lib/config')
const { conn } = require('../db')

//const sequelize = new conn();
//
const getAccess = async (req, res, next) => {
  try {
    const userId = res.locals.userId

    //Obtenemos los módulos padres
    const fathers = await Access.findAll({
      where: {
        user_id: userId,
      },
      attributes: ['module_id'],
      include: [
        {
          model: Module,
          as: 'module',
          attributes: ['name', 'url', 'icon', ['module_id', 'father_id']],
          where: {
            module_id: null,
          },
        },
      ],
    })

    // Obtenemos lo módulos hijos
    const children = await Access.findAll({
      where: {
        user_id: userId,
      },
      attributes: ['module_id'],
      include: [
        {
          model: Module,
          as: 'module',
          attributes: ['id', 'name', 'url', 'icon', 'module_id'],
          where: {
            module_id: {
              [Op.not]: null,
            },
          },
        },
      ],
    })

    // Creamos un array con lo módulos padres e hijos
    let $modules = []
    fathers.map((father) => {
      let obj = {}
      obj.id = father.module_id
      obj.name = father.module.name
      obj.url = father.module.url
      obj.icon = father.module.icon

      let ob
      let newArray = []
      children.map((r) => {
        if (r.module.module_id === father.module_id) {
          ob = {
            id: r.module.id,
            name: r.module.name,
            url: r.module.url,
            icon: r.module.icon,
            father_id: r.module.module_id,
          }

          return newArray.push(ob)
        }
      })

      //Creamos objetos con elementos únicos
      const setHijosUnicos = new Set() // creamos pares de clave y array

      obj.sub_data = newArray.reduce((acc, elemento) => {
        const key = JSON.stringify(elemento)
        if (!setHijosUnicos.has(key)) {
          setHijosUnicos.add(key, elemento)
          acc.push(elemento)
        }
        return acc
      }, [])

      $modules.push(obj)
    })

    return res.json($modules)
  } catch (error) {
    next(error.message)
  }
}

const getActionsByModulo = async (req, res, next) => {
  try {
    const { moduleId } = req.params
    const userId = res.locals.userId
    //const userId = '1742ea0a-115e-4c4b-9017-8e2bf9776b18'

    //Obtenemos las acciones por modulo hijo
    const actions = await Access.findAll({
      where: {
        user_id: userId,
        module_id: moduleId,
      },
      attributes: ['module_id'],
      include: [
        {
          model: Action,
          as: 'action',
          attributes: ['name', 'action_param', 'onclick', 'icon'],
          where: {
            status: true,
          },
        },
      ],
    })

    let $actions = []
    actions.map((act) => {
      let obj = {
        name: act.action.name,
        action_param: act.action.action_param,
        onclick: act.action.onclick,
        icon: act.action.icon,
      }

      $actions.push(obj)
    })

    return res.json($actions)
  } catch (error) {
    next(error.message)
  }
}

const createAccess = async (req, res, next) => {
  try {
    const { user_id, module_id, action_id, status } = req.body
    // TODO: añadir validaciones de datos
    if (status) {
      await Access.create({
        user_id,
        module_id,
        action_id,
      })
    } else {
      await Access.destroy({
        where: {
          user_id,
          module_id,
          action_id,
        },
      })
    }

    return res.json({ message: 'Access created successfully' })
  } catch (error) {
    next(error.message)
  }
}

const getAccessUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    //console.log(userId)
    //const userId = '1742ea0a-115e-4c4b-9017-8e2bf9776b18';
    //console.log(userId);

    //Obtenemos los módulos padres
    /*
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
     */

    const fathers = await conn.query(
      'SELECT DISTINCT(module.id) AS id, module.name, module.url, mu.module_id ' +
        'FROM accesos mu ' +
        "RIGHT OUTER JOIN modules module ON module.id = mu.module_id AND mu.user_id = '" +
        userId +
        "'" +
        'WHERE module.module_id IS NULL',
      { type: QueryTypes.SELECT }
    )
    //console.log('fathers', fathers)

    // Obtenemos lo módulos hijos
    /*
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
    */
    const children = await conn.query(
      'SELECT DISTINCT(module.id) AS id, module.name, module.url, module.icon, mu.module_id, module.module_id AS father_id ' +
        'FROM accesos mu ' +
        "RIGHT OUTER JOIN modules module ON module.id = mu.module_id AND mu.user_id = '" +
        userId +
        "'" +
        'WHERE module.module_id IS NOT NULL',
      { type: QueryTypes.SELECT }
    )
    //console.log('children', children)

    // Obtenemos todas las acciones
    /*
    let actions = await Access.findAll({
      where: {
        user_id: userId,
        module_id: {
          [Op.not]: null
        }
      },
      attributes: ['module_id'],
      include : [
        {
          model: Action,
          as : 'action',
          attributes: ['id', 'name', 'action_param', 'onclick', 'icon'],

        }
      ]
    });
    */
    const actions = await conn.query(
      'SELECT DISTINCT(action.id), mu.action_id, module.id AS module_id, action.name, action.action_param, action.onclick, action.icon ' +
        'FROM accesos mu ' +
        'INNER JOIN modules module ON module.id = mu.module_id ' +
        "RIGHT OUTER JOIN actions action ON action.id = mu.action_id AND mu.user_id = '" +
        userId +
        "' ",
      { type: QueryTypes.SELECT }
    )
    //console.log('actions', actions)

    // Obtenemos todas las acciones de la tabla actions_module
    /*
    let actions = await Access.findAll({
      where: {
        user_id: userId,
        module_id: {
          [Op.not]: null
        }
      },
      attributes: ['module_id'],
      include : [
        {
          model: Action,
          as : 'action',
          attributes: ['id', 'name', 'action_param', 'onclick', 'icon'],

        }
      ]
    });
    */
    const actions_modules = await conn.query(
      'SELECT action.id, ' +
        '"moduleId"' +
        ' AS module_id, action.name, action.action_param, action.onclick, action.icon ' +
        'FROM actions_modules am ' +
        'INNER JOIN actions action ON action.id = ' +
        '"actionId"' +
        ' ',
      { type: QueryTypes.SELECT }
    )
    // console.log('actions_modules', actions_modules)

    // Creamos un array con lo módulos padres e hijos
    let $modules = []
    fathers.map((father) => {
      let obj = {}
      obj.id = father.id
      obj.module_id = father.module_id
      obj.name = father.name
      obj.url = father.url
      obj.icon = father.icon
      obj.sub_data = []

      let obHijo
      let newArray = []
      children.map((ch) => {
        if (ch.father_id === father.id) {
          obHijo = {
            id: ch.id,
            name: ch.name,
            url: ch.url,
            icon: ch.icon,
            module_id: ch.module_id,
            actions: [],
          }
          //console.log(obHijo)
          return newArray.push(obHijo)
        }
      })

      //Creamos objetos con elementos únicos
      const setObj = new Set() // creamos pares de clave y array

      let setHijosUnicos = newArray.reduce((acc, hijo) => {
        const clave = JSON.stringify(hijo)
        if (!setObj.has(clave)) {
          setObj.add(clave, hijo)
          acc.push(hijo)
        }

        return acc
      }, [])
      //console.log(unicos)
      obj.sub_data = setHijosUnicos

      $modules.push(obj)

      //console.log(obj.sub_data)
      // Adicionamos las actions a los módulos hijos
      actions.map((act) => {
        //console.log(act)
        obj.sub_data.map((mod) => {
          if (act.module_id === mod.id) {
            //console.log(mod.name, act.action.name)
            mod.actions.push({
              id: act.id,
              action_id: act.action_id,
              name: act.name,
              action_param: act.action_param,
              onclick: act.onclick,
              icon: act.icon,
            })
          }
        })
      })

      ////////
      actions_modules.map((act) => {
        //console.log(act)
        obj.sub_data.map((mod, index) => {
          if (act.module_id === mod.id) {
            if (mod.actions.length > 0) {
              // Verificamos si es que ya existe
              let verificar = mod.actions.some((at) => {
                return at.id === act.id
              })
              if (verificar === false) {
                mod.actions.push({
                  id: act.id,
                  action_id: null,
                  name: act.name,
                  action_param: act.action_param,
                  onclick: act.onclick,
                  icon: act.icon,
                })
              }
            } else {
              mod.actions.push({
                id: act.id,
                action_id: null,
                name: act.name,
                action_param: act.action_param,
                onclick: act.onclick,
                icon: act.icon,
              })
            }
          }
        })
      })
    })

    return res.json($modules)
  } catch (error) {
    next(error.message)
  }
}

module.exports = {
  getAccess,
  createAccess,
  getActionsByModulo,
  getAccessUser,
}
