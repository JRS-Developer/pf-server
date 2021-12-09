const express = require('express')
const router = express.Router()

const {
    get_materia,
    create_materia,
    delete_materia
} = require('../controllers/materias.controller')

router.get('/', get_materia)
router.post('/', create_materia)
router.delete('/:id', delete_materia)

module.exports = router