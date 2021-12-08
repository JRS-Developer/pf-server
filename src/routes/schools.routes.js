const router = require('express').Router()
const {
  updateSchoolById,
  deleteSchoolById,
  createSchool,
  getSchools,
} = require('../controllers/schools.controller')

router.get('/', getSchools)
router.post('/', createSchool)

router.put('/:id', updateSchoolById)
router.delete('/:id', deleteSchoolById)

module.exports = router
