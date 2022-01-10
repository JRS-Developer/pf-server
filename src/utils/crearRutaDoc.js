const crearRuta = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/files/${filename}`
}

module.exports = crearRuta
