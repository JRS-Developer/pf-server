const express = require('express')
const router = express.Router()

const{
    get_notes,
    create_note,
    delete_note,
    upDate_note
} = require('../controllers/notes.controller')
const { verifyToken, esSuperUserOrAdmin } = require('../middlewares/auth');
router.use(verifyToken)


router.get('/',  get_notes) //sUser, admin, el alumno, el profesor y el tutor del alumno
router.post('/', create_note) //sUser, admin y el profesor
router.delete('/:id', esSuperUserOrAdmin, delete_note) 
router.put('/:id', upDate_note) //sUser, admin, el profesr

module.exports = router