const express = require('express')
const router = express.Router()

const {
  getActions,
  createAction,
  getActionById,
  updateActionById,
  deleteActionById
} = require('../controllers/action.controller')
const { verifyToken, esSuperUser, esSuperUserOrAdmin } = require('../middlewares/auth');



router.get('/', esSuperUserOrAdmin, getActions)  //admin y sUser
router.get('/:id', esSuperUserOrAdmin, getActionById)  //admin y sUser
router.post('/', esSuperUser, createAction) // sUser
router.put('/:id', esSuperUser, updateActionById) //sUser
router.delete('/:id', esSuperUser, deleteActionById) //sUser

module.exports = router