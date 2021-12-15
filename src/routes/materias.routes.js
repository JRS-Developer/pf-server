const express = require('express')
const router = express.Router()

const {
    get_materia,
    create_materia,
    delete_materia
} = require('../controllers/materias.controller')
const { verifyToken, esSuperUserOrAdminOrProfesor ,esSuperUserOrAdmin } = require('../middlewares/auth');


router.use(verifyToken)

router.get('/', esSuperUserOrAdmin, get_materia) //sUser, admin y los participantes(profesor participante, verificar q sea profesor en el rol)
router.post('/', esSuperUserOrAdminOrProfesor, create_materia) 
router.delete('/:id',esSuperUserOrAdmin ,delete_materia) 


//crear un put materia y q el profesor lo pueda editar

module.exports = router