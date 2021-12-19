const cloudinary = require('cloudinary').v2
require('dotenv').config()

if (!process.env.CLOUDINARY_URL)
  console.error(
    'Por favor coloca la variable CLOUDINARY_URL en tu archivo .env'
  )

const imagen = (url) => {
  return cloudinary.uploader.upload(url, (err, result) => {
    if (err) throw err
    return result
  })
}

module.exports = imagen
