const router = require('express').Router()
const {
  getPublications,
  updatePublication,
  createPublication,
  deletePublication,
  likePublication
} = require('../controllers/publications.controller')
const { verifyToken } = require('../middlewares/auth')

router.use(verifyToken)

router.get('/', getPublications)
router.post('/', createPublication)

router.put('/:id/', updatePublication)
router.put('/:id/like', likePublication)

router.delete('/:id', deletePublication)

module.exports = router
