const Subscription = require('../models/Subscriptions')
const Notification = require('../models/Notification')
const webpush = require('../services/webpushConfig')

const subscription = async (req, res, next) => {
  try {
    const { sub, user } = req.body
    // Reviso que la subscripción no exista
    const exist = await Subscription.findOne({
      where: { userId: user, endpoint: sub.endpoint },
    })

    if (exist) {
      return res.sendStatus(409)
    }

    // Creo la subscripcion
    const res = await Subscription.create({ ...sub, userId: user })

    res.json({ msg: 'conexión exitosa' })
  } catch (error) {
    next(error)
    console.error(error)
  }
}

const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.query

    const notifications = await Notification.findAll({
      where: { userId, status: true },
      order: [['createdAt', 'DESC']],
    })

    res.json(notifications)
  } catch (error) {
    next(error)
    console.error(error)
  }
}

// Esta funcion tal vez no se necesite, pero por si acaso
const createNotification = async (req, res, next) => {
  try {
    const { message, url, receivers } = req.body

    // Creo la notificacion
    const newNotification = await Notification.create({ message, url })

    // Asigno los que van a recibir la notificacion
    await newNotification.setUsers(receivers)

    // Envio la notificacion a todos los receivers
    let promises = receivers.map(
      async (r) =>
        await Subscription.find(/*{ where: { userId: r } }*/).then(
          async (subs) =>
            subs.map(
              async (sub) => await webpush.sendNotification(sub, message)
            )
        )
    )

    const results = await Promise.allSettled(promises)

    console.log(results)

    res.sendStatus(200)
  } catch (error) {
    next(error)
    console.error(error)
  }
}

module.exports = {
  subscription,
  getNotifications,
}
