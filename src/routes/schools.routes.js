const router = require('express').Router()
const {
  updateSchoolById,
  deleteSchoolById,
  createSchool,
  getSchools,
} = require('../controllers/schools.controller')
const { verifyToken } = require('../middlewares/auth')

router.use(verifyToken)

router.get('/', getSchools) //sUser
router.post('/', createSchool) //sUser

router.put('/:id', updateSchoolById) //sUser
router.delete('/:id', deleteSchoolById) //sUser

module.exports = router
