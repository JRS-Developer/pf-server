const { ExamenesNotas, Matricula, Classes, Schools, CicloElectivo, Materias, User } = require('../models');

const getNotas = async (req, res, next) => {
  try {
    const notas = await ExamenesNotas.findAll({
      attributes: ['id', 'nota', 'examen', 'materia_id', 'periodo', 'matriculaId'],
      include: [
        {
          model:
          Matricula,
          attributes: ['id', 'fecha', 'student_id', 'school_id', 'clase_id', 'ciclo_lectivo_id', 'status'],
          include: [
            {
              model: Classes,
              attributes: ['id', 'name']
            },{
              model: Schools,
              attributes: ['id', 'name']
            },{
              model: CicloElectivo,
              attributes: ['id', 'name']
            },{
              model: User,
              attributes: ['id','identification', 'firstName', 'lastName']
            }
          ]
        },{
          model: Materias,
          attributes: ['id', 'name']
        }
      ]
    })

    return res.json(notas)

  }catch (error) {
    next(error.message)
  }
}

const addNotas = async (req, res, next) => {
  try {
    const { materia_id, matriculaId, examen, nota, periodo } = req.body

    await ExamenesNotas.create({
      materia_id, matriculaId, examen, nota, periodo
    })

    res.json({ message: 'notas successfully created' })

  }catch (error) {
    next(error.message)
  }
}

module.exports = {
  getNotas,
  addNotas
}