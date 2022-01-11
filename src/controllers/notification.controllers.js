// const Subscription = requir('../models/Subscriptions')

const subscription = async (req, res, next) => {
  try {
    // const { sub , user} = req.body;
    console.log(req.body)
    // const res = await Subscription.create()

    console.log('conexión exitosa')
    res.json({ msg: 'conexión exitosa' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  subscription,
}
