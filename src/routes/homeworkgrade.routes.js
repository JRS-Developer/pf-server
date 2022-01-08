/*
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
CUIDADO, ESTE ARCHIVO ESTÁ DEPRECADO
*/

const express = require('express')
const router = express.Router()

const {
  get_homeworkgrades,
  create_homeworkgrade,
  delete_homeworkgrade,
  upDate_homeworkgrade,
} = require('../controllers/homeworkgrade.controller')
const {
  verifyToken,
  esSuperUserOrAdmin,
  esSuperUserOrAdminOrProfesor,
} = require('../middlewares/auth')
router.use(verifyToken)

router.get('/', get_homeworkgrades) //sUser, admin, el alumno, el profesor y el tutor del alumno
router.post('/', esSuperUserOrAdminOrProfesor, create_homeworkgrade)
router.delete('/:id', esSuperUserOrAdmin, delete_homeworkgrade)
router.put('/:id', esSuperUserOrAdminOrProfesor, upDate_homeworkgrade)

module.exports = router
