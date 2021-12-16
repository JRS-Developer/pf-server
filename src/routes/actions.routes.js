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

router.use(verifyToken)

router.get('/', esSuperUserOrAdmin, getActions)  
router.get('/:id', esSuperUserOrAdmin, getActionById) 
router.post('/', esSuperUser, createAction)
router.put('/:id', esSuperUser, updateActionById) 
router.delete('/:id', esSuperUser, deleteActionById) 

module.exports = router