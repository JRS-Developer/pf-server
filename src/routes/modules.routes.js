const express = require('express')
const router = express.Router()

const {
  getModules,
  createModule,
  getModuleById,
  updateModuleById,
  deleteModuleById
} = require('../controllers/module.controller')

router.get('/', getModules)
router.get('/:id', getModuleById)
router.post('/', createModule)
router.put('/:id', updateModuleById)
router.delete('/:id', deleteModuleById)

module.exports = router