const file = require('../utils/multer')

const getFile = (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
}

const uploadFile = (req, res, next) => {
  try {
    //lógica para guardar documento en el modelo correspondiente

    res.json({ msg: 'file upload succesfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getFile,
  uploadFile,
}
