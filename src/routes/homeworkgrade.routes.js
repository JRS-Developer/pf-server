const express = require('express')
const router = express.Router()

const{
    get_homeworkgrades,
    create_homeworkgrade,
    delete_homeworkgrade,
    upDate_homeworkgrade
} = require('../controllers/homeworkgrade.controller')
const { verifyToken, esSuperUserOrAdmin } = require('../middlewares/auth');
router.use(verifyToken)


router.get('/',  get_homeworkgrades) //sUser, admin, el alumno, el profesor y el tutor del alumno
router.post('/', create_homeworkgrade) //sUser, admin y el profesor
router.delete('/:id', esSuperUserOrAdmin, delete_homeworkgrade) 
router.put('/:id', upDate_homeworkgrade) //sUser, admin, el profesr

module.exports = router