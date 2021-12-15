const { Role } = require('../models')
const jwt = require('jsonwebtoken')
const { secret } = require('../lib/config')
const { where } = require('sequelize/dist')

const verifyToken = async (req, res, next) => {
  try {
    // Obtengo el token
    const token = req.headers['x-access-token']
          
    // Si no manda el token, entonces responde con un error
    if (!token)
      return res.status(403).json({ error: 'A JWT token is required' })

    // Verifico que el token sea valido
    const tokenDesencriptado = jwt.verify(token, secret)

    res.locals.userId = tokenDesencriptado.id;

    return next()
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 401
    res.status(401).json({ error: error.message })
  }
}

const esSuperUser = async (req, res, next) => {
  try {
    // Obtengo el token desencriptado y el rol
    const token = req.headers['x-access-token']
    const sUser = await Role.findAll({where: {name: 'sUser'}})
    const tokenDesencriptado = jwt.verify(token, secret)
      
    // Verifico que el token sea valido
    //console.log(tokenDesencriptado.roles)
    if (tokenDesencriptado.roles === sUser[0].id){
    return next()}
    console.log("Problemas con tu auth")
    return false
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 403
    res.status(403).json({ error: "No tienes permisos para ingresar" })
  }
}

const esSuperUserOrAdmin = async (req, res, next) => {
  try {
    // Obtengo el token desencriptado y el rol
    const token = req.headers['x-access-token']
    const sUser = await Role.findAll({where: {name: 'sUser'}})
    const admin = await Role.findAll({where: {name: 'Admin'}})

    // Verifico que el token sea valido
    const tokenDesencriptado = jwt.verify(token, secret)
    //console.log(tokenDesencriptado.roles)
    if (tokenDesencriptado.roles === sUser[0].id || tokenDesencriptado.roles === admin[0].id ){
    console.log("Ingresaste correctamente")
    return next()}
    console.log("Problemas con tu auth")
    res.status(403).json({ error: "No tienes permisos para ingresar" })
    
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 403
    res.status(403).json({ error: "No tienes permisos para ingresar" })
  }
}

const esSuperUserOrAdminOrProfesor = async (req, res, next) => {
  try {
    // Obtengo el token desencriptado y el rol
    const token = req.headers['x-access-token']
    const sUser = await Role.findAll({where: {name: 'sUser'}})
    const admin = await Role.findAll({where: {name: 'Admin'}})
    const profesor = await Role.findAll({where: {name: 'Profesor'}})

    // Verifico que el token sea valido
    const tokenDesencriptado = jwt.verify(token, secret)
    console.log(tokenDesencriptado.roles)
    if (tokenDesencriptado.roles === sUser[0].id || tokenDesencriptado.roles === admin[0].id || tokenDesencriptado.roles === profesor[0].id ){
    console.log("Ingresaste correctamente")
    return next()}
    console.log("Problemas con tu auth")
    res.status(403).json({ error: "No tienes permisos para ingresar" })
    
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 403
    res.status(403).json({ error: "No tienes permisos para ingresar" })
  }
}



const esProfesor = async (req, res, next) => {
  try {
    // Obtengo el token desencriptado y el rol
    const token = req.headers['x-access-token']
    const profesor = await Role.findAll({where: {name: 'Profesor'}})
  
    // Verifico que el token sea valido
    const tokenDesencriptado = jwt.verify(token, secret)
    console.log(tokenDesencriptado.roles)
    if (tokenDesencriptado.roles === sUser[0].id || tokenDesencriptado.roles === profesor[0].id ){
    console.log("Ingresaste correctamente")
    return next()}
    console.log("Problemas con tu auth")
    res.status(403).json({ error: "No tienes permisos para ingresar" })
    
  } catch (error) {
    // Si el token no es valido, entonces retorno un error 403
    res.status(403).json({ error: "No tienes permisos para ingresar" })
  }
}





module.exports = {
  verifyToken,
  esSuperUser,
  esSuperUserOrAdmin,
  esSuperUserOrAdminOrProfesor,
  esProfesor
}
