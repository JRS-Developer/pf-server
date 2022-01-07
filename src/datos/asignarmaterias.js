const { materias } = require('./materias.js')
const { classes } = require('./classes.js')
const { users } = require('./users.js')

const ciclolectivo2022 = '0444e7eb-4aa2-4378-8287-cd93d55fa655' //Está definido en el archivo seed linea 190.
const escuelaprincipal = '36ba79e8-30cb-4b91-8424-bd2f634917e8'

function userIdsByRole(role) {
  const array = users
    .filter((user) => user.roleId === role)
    .map((user) => {
      return { teacher_id: user.id, lastName: user.lastName } //En lastname estoy poniendo el nombre de la materia. Por un lado nos sirve a nosotros para identificarlos y por otro para filtrar y asignarle la materia correspondiente.
    })
  return array
}

const profesores = userIdsByRole('606c0802-5332-4531-9189-eac84e6fcceb')

let assignMaterias = []

classes.forEach((clase) =>
  materias.forEach((materia) =>
    profesores.forEach((profesor) => {
      if (profesor.lastName === materia.name) {
        assignMaterias = [
          ...assignMaterias,
          {
            school_id: escuelaprincipal,
            ciclo_lectivo_id: ciclolectivo2022,
            teacher_id: profesor.teacher_id,
            materia_id: materia.id,
            clase_id: clase.id
          },
        ]
      }
    })
  )
)

module.exports = { assignMaterias }