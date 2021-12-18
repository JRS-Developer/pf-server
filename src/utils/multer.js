const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files')
    },
    filename: (req, file, cb) => {

        console.log(file)
        cb(null, `${file.originalname.slice(0, file.originalname.indexOf('.'))}-${Date.now()}${file.originalname.slice(file.originalname.indexOf('.'))}`);
    },
});

const upload = multer({storage});

const file = upload.single('myFile')

module.exports = file