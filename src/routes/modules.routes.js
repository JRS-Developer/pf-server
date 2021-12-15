const express = require('express')
const router = express.Router()

const {
  getModules,
  createModule,
  getModuleById,
  updateModuleById,
  deleteModuleById
} = require('../controllers/module.controller')
const { verifyToken, esSuperUser, esSuperUserOrAdmin } = require('../middlewares/auth');

router.get('/', esSuperUser, getModules) //sUser
router.get('/:id', esSuperUser, getModuleById) //sUser
router.post('/', esSuperUser, createModule) //sUser
router.put('/:id', esSuperUser, updateModuleById) //sUser
router.delete('/:id', esSuperUser, deleteModuleById) //sUser

module.exports = router