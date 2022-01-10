const router = require('express').Router()
const {
  updateSchoolById,
  deleteSchoolById,
  createSchool,
  getSchools,
  getSchoolById,
} = require('../controllers/schools.controller')

const { verifyToken, esSuperUser } = require('../middlewares/auth')

router.use(verifyToken)

router.get('/', esSuperUser, getSchools)
router.get('/:id', esSuperUser, getSchoolById)
router.post('/', esSuperUser, createSchool)

router.put('/:id', esSuperUser, updateSchoolById)
router.patch('/:id', esSuperUser, deleteSchoolById)

module.exports = router
