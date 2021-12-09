const express = require('express')
const router = express.Router()

const{
    get_notes,
    create_note,
    delete_note,
    upDate_note
} = require('../controllers/notes.controller')

router.get('/', get_notes)
router.post('/', create_note)
router.delete('/:id', delete_note)
router.put('/:id', upDate_note)

module.exports = router