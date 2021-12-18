const express = require('express');
const router = express.Router();
const { 
    getFile,
    uploadFile
} = require('../controllers/files.controller');
const file = require('../utils/multer');

router.get('/', getFile)
router.post('/', file, uploadFile)


module.exports = router