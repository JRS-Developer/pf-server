const { Access, Module, User} = require('../models')
const {Sequelize, Op} = require("sequelize");

//
const getAccess = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const modules = Access.findAll({
      where: {
        module_id: 0
      },
      include : [
        {
          model: User,
          as: 'Users'
        }, {
          model : Module,
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('id'))],
            ['module_id', 'access_module_id'],
            ['name', 'module'], ['id', 'module_id']
          ],
          where: {'$Users.id' : { [Op.ne]: user_id }},
          required: false,
          right: true
        }
      ]
    })
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

