const { TeachersMaterias, Schools, Classes, Materias} = require('../models')
const { Sequelize , Op, QueryTypes } = require("sequelize");
const { secret } = require("../lib/config");
const { conn } = require('../db');

const getTeachersMaterias = async (req, res, next) => {
  try {
    const { school_id, clase_id, teacher_id } = req.body;
    const materias = await TeachersMaterias.findAll({
      where: {
        school_id,
        clase_id,
        teacher_id
      },
      include: [
        {
          model: Materias,
          attributes: ['id', 'name']
        }
      ]
    })

    return res.json(materias)

  }catch (error) {
    next(error.message)
  }
}

const asignarMaterias = async (req, res, next) => {
  console.log(req.body)
  try {
    const { school_id, clase_id, materia_id, teacher_id, status } =
      req.body
    // TODO: añadir validaciones de datos
    if(status){
      await TeachersMaterias.create({
        school_id,
        clase_id,
        materia_id,
        teacher_id
      })
    }else{
      await TeachersMaterias.destroy({
        where: {
          school_id,
          clase_id,
          materia_id,
          teacher_id
        }
      })
    }

    return res.json({ message: 'Materia asignada correctamente' })
  } catch (error) {
    next(error.message)
  }
}

module.exports = {
  getTeachersMaterias,
  asignarMaterias
}