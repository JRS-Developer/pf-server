const multer = require('multer')
const path = require('path')
const fs = require('fs-extra')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = path.join(__dirname, '../../files')

    // Con ensureDir comprueba que la carpeta files exista, si
    // no existe entonces la crea, asi evitamos errores 500 de parte de multer.
    fs.ensureDir(directory).then(() => {
      cb(null, directory)
    })
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
  multiFiles,
}
