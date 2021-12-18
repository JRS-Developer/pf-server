const cloudinary = require('cloudinary').v2

const imagen = (url) => {
  return cloudinary.uploader.upload(url, (err, result) => {
    if (err) throw err
    return result
  })
}

module.exports = imagen