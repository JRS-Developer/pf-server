const router = require('express').Router()
const {
  updateSchoolById,
  deleteSchoolById,
  createSchool,
  getSchools,
} = require('../controllers/schools.controller')
const { verifyToken, esSuperUser } = require('../middlewares/auth');

router.use(verifyToken)

router.get('/', esSuperUser, getSchools) 
router.post('/', esSuperUser, createSchool) 

router.put('/:id', esSuperUser, updateSchoolById) 
router.delete('/:id', esSuperUser, deleteSchoolById) 

module.exports = router
