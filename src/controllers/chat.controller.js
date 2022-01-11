const { Matricula, TeachersMaterias, User } = require('../models/')
const Joi = require('joi')

const getUsersOfChatS = Joi.object({
  materia_id: Joi.string().uuid().required(),
  clase_id: Joi.string().uuid().required(),
  school_id: Joi.string().uuid().required(),
  ciclo_lectivo_id: Joi.string().uuid().required(),
})

const getUsersOfChat = async (req, res, next) => {
  try {
    // Obtengo los estudiantes y los profesores que coincidan con la materiaId, classId, schoolId y cicloLectivoId
    // Con esto se obtienen los usuarios que participan en el chat
    const { materia_id, clase_id, school_id, ciclo_lectivo_id } = req.query

    const data = {
      materia_id,
      clase_id,
      school_id,
      ciclo_lectivo_id,
    }

    const { error } = getUsersOfChatS.validate(data)

    if (error) return res.status(400).json({ error: error.details[0].message })

    const studentsFound = Matricula.findAll({
      where: {
        clase_id,
        ciclo_lectivo_id,
        school_id,
      },
      attributes: ['student_id'],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatar'],
        },
      ],
    })

    const teachersFound = TeachersMaterias.findAll({
      where: data,
      attributes: ['teacher_id'],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatar'],
        },
      ],
    })

    const [students, teachers] = await Promise.all([
      studentsFound,
      teachersFound,
    ])

    res.json({
      students,
      teachers,
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getUsersOfChat,
}
