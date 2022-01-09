const express = require('express')
const router = express.Router()

const {
  getModules,
  createModule,
  getModuleById,
  updateModuleById,
  deleteModuleById,
} = require('../controllers/module.controller')
const { verifyToken, esSuperUser } = require('../middlewares/auth')

router.use(verifyToken)

router.get('/', esSuperUser, getModules)
router.get('/:id', esSuperUser, getModuleById)
router.post('/', esSuperUser, createModule)
router.put('/:id', esSuperUser, updateModuleById)
router.delete('/:id', esSuperUser, deleteModuleById)

module.exports = router
