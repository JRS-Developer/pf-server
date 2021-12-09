const express = require('express')
const router = express.Router()

const {
  getActions,
  createAction,
  getActionById,
  updateActionById,
  deleteActionById
} = require('../controllers/action.controller')

router.get('/', getActions)
router.get('/:id', getActionById)
router.post('/', createAction)
router.put('/:id', updateActionById)
router.delete('/:id', deleteActionById)

module.exports = router