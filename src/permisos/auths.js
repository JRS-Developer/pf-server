const { ROLE, aulas, users } = require('../datos/datos')


function puedeVerAula(req, res, next) {
    const {userId} = req.body
    // console.log(userId)
    // console.log(req.params.aulaId)
    const aula = aulas.filter(a=> a.id === parseInt(req.params.aulaId))[0]
    console.log(aula)
    console.log(aula.userId)
    console.log(req.body.userId)
    console.log(aula.userId.find(u => u === userId))
    
    

    if(aula.userId.find(u => u === userId) || userId === 1){
    console.log("Puedes ver esta aula porque estas en ella")
    return next()
    }

    res.send("No entraste al if")

//   return (
//     user.rol === "sAdmin" ||
//     aula.userId === user.id
//   )
}

function puedeVerAulas(user, aulas) {
  if (user.rol === rol.sAdmin) return aulas
  return aulas.filter(aula => aula.userId === user.id)
}

function puedeEliminarAula(user) {
  return user.Id === 1
}


function authUser(req, res, next) {
    if (req.body.userId == null) {
      res.status(403)
      return res.send('Necesitas logearte primero')
    }
  
    return next()
}
  
  function authRole(rol) {
    return (req, res, next) => {
      if (req.user.rol !== rol) {
        res.status(401)
        return res.send('No tienes el permiso necesario, consulta al administrador')
      }
  
      next()
    }
  }
  
module.exports = {
    puedeVerAula,
    puedeVerAulas,
    puedeEliminarAula,
    authUser,
    authRole
}