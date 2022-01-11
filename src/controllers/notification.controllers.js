const subscription = (req, res, next) => {
  try {
    console.log('conexión exitosa')
    res.json({ msg: 'conexión exitosa' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  subscription,
}
