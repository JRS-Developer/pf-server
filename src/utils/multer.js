const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../files'))
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.originalname.slice(
        0,
        file.originalname.indexOf('.')
      )}-${Date.now()}${file.originalname.slice(
        file.originalname.indexOf('.')
      )}`
    )
  },
})

const upload = multer({ storage })

const file = upload.single('myFile')
const multiFiles = upload.array('myFile')

module.exports = {
  file,
  multiFiles
}
