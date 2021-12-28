const router = require('express').Router()
const {
  getPublications,
  getOnePublication,
  updatePublication,
  createPublication,
  deletePublication,
  likePublication,
} = require('../controllers/publications.controller')
const { verifyToken } = require('../middlewares/auth')
const { multiFiles } = require('../utils/multer')

router.use(verifyToken)

router.get('/', getPublications)
router.get('/:id', getOnePublication)
router.post('/', multiFiles, createPublication)

router.put('/:id/', multiFiles, updatePublication)
router.put('/:id/like', likePublication)

router.delete('/:id', deletePublication)

module.exports = router
