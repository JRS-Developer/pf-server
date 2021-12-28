const { Sequelize , Op, QueryTypes } = require("sequelize");
const { secret } = require("../lib/config");
const { conn } = require('../db');
const { User, CicloElectivo, Classes, Matricula, Materias} = require('../models')

const getMatriculas = async (req, res, next) => {
  try {

    const matriculas = await Matricula.findAll({
      include: [
        {
          model: User,
          attributes: ['lastName', 'firstName', 'identification']
        }, {
          model: Classes,
          attributes: ['name']
        },{
          model: CicloElectivo,
          attributes: ['name']
        }
      ]
    })

    let listMatriculas = [];
    matriculas.map(matricula =>{
      listMatriculas.push({
        id: matricula.id,
        fecha: matricula.fecha,
        student_id: matricula.student_id,
        clase_id: matricula.clase_id,
        ciclo_electivo_id: matricula.ciclo_electivo_id,
        student: `${matricula.user.firstName} ${matricula.user.lastName}`,
        identification: matricula.user.identification,
        class: matricula.class.name,
        ciclo_electivo: matricula.ciclo_electivo.name
      })
    })

    return res.json(listMatriculas);

  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getMatriculaById = async (req, res, next) => {
  const { id } = req.params;

  try {

    const matricula = await Matricula.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'lastName', 'firstName', 'identification']
        }, {
          model: Classes,
          attributes: ['id','name']
        },{
          model: CicloElectivo,
          attributes: ['id', 'name']
        }
      ]
    })

    return res.json(matricula);

  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createMatricula = async (req, res, next) => {
  try {
    const { fecha, student_id, clase_id, ciclo_electivo_id } = req.body

    await Matricula.create({
      fecha,
      student_id,
      clase_id,
      ciclo_electivo_id
    })

    return res.json({ message: 'Matrícula created successfully' })
  } catch (error) {
    //console.error(error)
    next(error)
  }
}

const updateMatriculaById = async (req, res, next) => {
  try {

    const {fecha, clase_id, ciclo_electivo_id, student_id } = req.body

    const { id } = req.params

    if( !req.body.student_id ){
      const [count, updatedMatricula] = await Matricula.update(
        { status: req.body.status },
        {
          where: {
            id,
          },
        }
      )
      if (count === 0)
        return res.json({ message: 'Status updated successfully' })

      res.json({ message: 'Matrícula updated' })
    }else{
      const [count, updatedMatricula] = await Matricula.update(
        { fecha, clase_id, ciclo_electivo_id, student_id },
        {
          where: {
            id,
          },
        }
      )

      if (count === 0)
        return res.status(400).json({ error: 'No se pudo actualizar la matrícula.' })

      res.json({ message: 'Matrícula updated' })
    }

    return res
      .status(400)
      .json({ message: 'There is not any matricula with that ID' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getDatosMatricula =  async (req, res, next) => {
  try {
    const studentId = res.locals.userId;
    const datos = await Matricula.findOne({
      where: {
        student_id: studentId
      },
      order: [
        ['fecha', 'DESC']
      ],
      limit: 1,
      include: [
        {
          model: User,
          attributes: ['lastName', 'firstName', 'identification']
        }, {
          model: Classes,
          attributes: ['name', 'school_id'],
          include: [
            {
              model: Materias
            }
          ]
        }, {
          model: CicloElectivo,
          attributes: ['name']
        }
      ]
    })

    return res.json(datos);
  }catch (error) {
    console.error(error)
    next(error)
  }

}

module.exports = {
  getMatriculas,
  createMatricula,
  getMatriculaById,
  updateMatriculaById,
  getDatosMatricula
}