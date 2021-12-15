const express = require('express')
const router = express.Router()

const {
    get_materia,
    create_materia,
    delete_materia
} = require('../controllers/materias.controller')
const { verifyToken, esSuperUser, esProfesor ,esSuperUserOrAdmin } = require('../middlewares/auth');

router.get('/', esSuperUserOrAdmin, get_materia) //sUser, admin y los participantes(profesor participante, verificar q sea profesor en el rol)
router.post('/', [esSuperUserOrAdmin || esProfesor], create_materia) //sUser, admin y profesor  ---- VERIFICAR ESTO
router.delete('/:id',esSuperUserOrAdmin ,delete_materia) //sUser, admin


//crear un put materia y q el profesor lo pueda editar

module.exports = router