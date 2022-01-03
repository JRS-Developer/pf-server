const router = require('express').Router()
const {
  getPublications,
  getOnePublication,
  updatePublication,
  createPublication,
  deletePublication,
  likePublication,
} = require('../controllers/publications.controller')
const {
  verifyToken,
  esSuperUserOrAdminOrProfesor,
} = require('../middlewares/auth')
const { multiFiles } = require('../utils/multer')

router.use(verifyToken)

router.get('/', esSuperUserOrAdminOrProfesor, getPublications)
router.get('/:id', esSuperUserOrAdminOrProfesor, getOnePublication)
router.post('/', esSuperUserOrAdminOrProfesor, multiFiles, createPublication)

router.put('/:id/', esSuperUserOrAdminOrProfesor, multiFiles, updatePublication)
router.put('/:id/like', esSuperUserOrAdminOrProfesor, likePublication)

router.delete('/:id', esSuperUserOrAdminOrProfesor, deletePublication)

module.exports = router
