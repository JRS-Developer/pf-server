const { ExamenesNotas, Matricula, Classes, Schools, CicloElectivo, Materias, User} = require('../models');

const getNotas = async (req, res, next) => {
  try {

    const {school_id, clase_id, ciclo_lectivo_id, id} = req.body // id => id de la materia

    const notas = await ExamenesNotas.findAll({
      where: {
        materia_id: id
      },
      attributes: ['id', 'fecha', 'nota', 'examen', 'materia_id', 'periodo', 'matriculaId'],
      include: [
        {
          model: Matricula,
          where: {
            school_id, clase_id, ciclo_lectivo_id
          },
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

    let $datos = [];
    notas.map(nt => {
      $datos.push({
        id: nt.id,
        fecha: nt.fecha,
        examen: nt.examen,
        nota: nt.periodo,
        periodo: nt.periodo,
        school: nt?.matricula?.school.name,
        clase: nt?.matricula?.class.name,
        ciclo_lectivo: nt?.matricula?.ciclo_electivo.name,
        student: `${nt?.matricula?.user.firstName} ${nt?.matricula?.user.lastName}`
      })
    })

    return res.json($datos)

  }catch (error) {
    next(error.message)
  }
}

const addNotas = async (req, res, next) => {
  try {
    const { fecha, materia_id, matriculaId, examen, nota, periodo } = req.body

    console.log(req.body)

    await ExamenesNotas.create({
      fecha, materia_id, matriculaId, examen, nota, periodo
    })

    res.json({ message: 'notas successfully created' })

  }catch (error) {
    next(error.message)
  }
}

const getExamenNotasById = async (req, res, next) => {
  const { id } = req.params
  try {
    const datos = await ExamenesNotas.findByPk(id, {
      include: [
        {
          model: Matricula,
          attributes: ['id'],
          include: {
            model: User,
            attributes: ['identification', 'firstName', 'lastName'],
          }
        }
      ]
    })

    res.json(datos)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateExamenNotasById = async (req, res, next) => {
  try {
    const { id, nota, examen, materia_id, periodo, matriculaId, fecha } = req.body

    await ExamenesNotas.update(
      { nota, examen, materia_id, periodo, matriculaId, fecha },
      {
        where: { id }
      }
    )

    res.status(201).json({ message: 'Nota updated successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getNotas,
  addNotas,
  getExamenNotasById,
  updateExamenNotasById
}