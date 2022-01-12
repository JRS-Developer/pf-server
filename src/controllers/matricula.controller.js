const {
  User,
  CicloElectivo,
  Classes,
  Matricula,
  Materias,
  Schools,
  TeachersMaterias,
} = require('../models')

const getMatriculas = async (req, res, next) => {
  try {
    const matriculas = await Matricula.findAll({
      include: [
        {
          model: User,
          attributes: ['lastName', 'firstName', 'identification'],
        },
        {
          model: Classes,
          attributes: ['name'],
        },
        {
          model: CicloElectivo,
          attributes: ['name'],
        },
        {
          model: Schools,
          attributes: ['id', 'name'],
        },
      ],
    })

    let listMatriculas = []
    matriculas.map((matricula) => {
      listMatriculas.push({
        id: matricula.id,
        fecha: matricula.fecha,
        student_id: matricula.student_id,
        clase_id: matricula.clase_id,
        ciclo_lectivo_id: matricula.ciclo_lectivo_id,
        student: `${matricula.user.firstName} ${matricula.user.lastName}`,
        identification: matricula.user.identification,
        class: matricula.class.name,
        ciclo_electivo: matricula.ciclo_electivo.name,
        school: matricula.school.name,
        status: matricula.status
      })
    })

    return res.json(listMatriculas)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getMatriculaById = async (req, res, next) => {
  const { id } = req.params

  try {
    const matricula = await Matricula.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'lastName', 'firstName', 'identification'],
        },
        {
          model: Classes,
          attributes: ['id', 'name'],
        },
        {
          model: CicloElectivo,
          attributes: ['id', 'name'],
        },
        {
          model: Schools,
          attributes: ['id', 'name'],
        },
      ],
    })

    return res.json(matricula)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getMatriculaByUserId = async (req, res, next) => {
  const { id } = req.params

  try {
    const userFind = await Matricula.findOne({ where: { student_id: id } })

    return res.json(userFind)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createMatricula = async (req, res, next) => {
  try {
    const { fecha, student_id, school_id, clase_id, ciclo_lectivo_id } =
      req.body

    await Matricula.create({
      fecha,
      student_id,
      school_id,
      clase_id,
      ciclo_lectivo_id,
    })

    return res.json({ message: 'Matrícula created successfully' })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateMatriculaById = async (req, res, next) => {
  try {
    const { fecha, clase_id, school_id, ciclo_lectivo_id, student_id } =
      req.body

    const { id } = req.params

    if (!req.body.student_id) {
      const [count] = await Matricula.update(
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
    } else {
      const [count] = await Matricula.update(
        { fecha, clase_id, school_id, ciclo_lectivo_id, student_id },
        {
          where: {
            id,
          },
        }
      )

      if (count === 0)
        return res
          .status(400)
          .json({ error: 'No se pudo actualizar la matrícula.' })

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

const getDatosMatricula = async (req, res, next) => {
  try {
    const studentId = res.locals.userId
    const datos = await Matricula.findOne({
      where: {
        student_id: studentId,
      },
      order: [['fecha', 'DESC']],
      limit: 1,
      include: [
        {
          model: User,
          attributes: ['lastName', 'firstName', 'identification'],
        },
        {
          model: Classes,
          attributes: ['name'],
          include: [
            {
              model: Materias,
              through: {
                attributes: [],
              },
            },
            {
              model: Schools,
              attributes: ['name', 'id'],
              through: {
                attributes: [],
              },
            },
            {
              model: TeachersMaterias,
              include: {
                model: User,
                attributes: ['lastName', 'firstName', 'id', 'avatar'],
              },
            },
          ],
        },
        {
          model: CicloElectivo,
          attributes: ['name'],
        },
      ],
    })

    return res.json(datos)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getStudentMatricula = async (req, res, next) => {
  try {
    const { school_id, clase_id, ciclo_lectivo_id } = req.body
    const matriculas = await Matricula.findAll({
      where: {
        school_id,
        clase_id,
        ciclo_lectivo_id,
      },
      attributes: ['id', 'student_id'],
      include: [
        {
          model: User,
          attributes: ['lastName', 'firstName', 'identification'],
        },
      ],
    })

    let students = []

    matriculas.map((mt) => {
      students.push({
        matricula_id: mt.id,
        student_id: mt.student_id,
        student: `${mt.user.identification} - ${mt.user.firstName} ${mt.user.lastName}`,
      })
    })

    return res.json(students)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getMatriculas,
  createMatricula,
  getMatriculaById,
  getMatriculaByUserId,
  updateMatriculaById,
  getDatosMatricula,
  getStudentMatricula,
}
