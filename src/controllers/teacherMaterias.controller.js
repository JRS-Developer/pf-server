const { TeachersMaterias, Materias } = require('../models')
const Joi = require('joi')

const asignarMateriasSchema = Joi.object({
  school_id: Joi.string().uuid().required(),
  clase_id: Joi.string().uuid().required(),
  materias: Joi.array().items(Joi.string().uuid()).required(),
  teacher_id: Joi.string().uuid().required(),
  ciclo_lectivo_id: Joi.string().uuid().required(),
  status: Joi.boolean().required(),
})

const getTeachersMaterias = async (req, res, next) => {
  try {
    const { school_id, clase_id, teacher_id, ciclo_lectivo_id } = req.body

    let where = {
      school_id,
      clase_id,
      ciclo_lectivo_id,
    }

    // SI hay teacher_id lo coloco (Es opcional)
    if (teacher_id) where.teacher_id = teacher_id

    const materias = await TeachersMaterias.findAll({
      where,
      include: [
        {
          model: Materias,
          attributes: ['id', 'name'],
        },
      ],
    })

    return res.json(materias)
  } catch (error) {
    next(error.message)
  }
}

const asignarMaterias = async (req, res, next) => {
  //console.log(req.body)
  try {
    // Materias: materia_id[]
    const {
      school_id,
      clase_id,
      materias,
      teacher_id,
      ciclo_lectivo_id,
      status,
    } = req.body

    const data = {
      school_id,
      clase_id,
      materias,
      teacher_id,
      ciclo_lectivo_id,
      status,
    }

    const { error } = asignarMateriasSchema.validate(data)

    if (error) return res.status(400).json({ error: error.details[0].message })

    if (status) {
      await materias.forEach(async (materia_id) => {
        const materia = await Materias.findOne({
          where: {
            id: materia_id,
          },
        })

        if (!materia)
          return res.status(400).json({ error: 'Materia no encontrada' })

        const teacherMateria = await TeachersMaterias.findOne({
          where: {
            school_id,
            clase_id,
            materia_id,
            teacher_id,
            ciclo_lectivo_id,
          },
        })

        if (teacherMateria)
          return res.status(400).json({ error: 'Materia ya asignada' })

        await TeachersMaterias.create({
          school_id,
          clase_id,
          materia_id,
          teacher_id,
          ciclo_lectivo_id,
          status,
        })
      })
    } else {
      await materias.forEach(async (materia_id) => {
        await TeachersMaterias.destroy({
          where: {
            school_id,
            clase_id,
            materia_id,
            teacher_id,
            ciclo_lectivo_id,
          },
        })
      })
    }

    return res.json({ message: 'Materias asignadas correctamente' })
  } catch (error) {
    next(error.message)
  }
}

module.exports = {
  getTeachersMaterias,
  asignarMaterias,
}
