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
    await Subscription.create({
      ...sub,
      keys: JSON.stringify(sub.keys),
      userId: user,
    })

    const response = await webpush.sendNotification(sub, 'test')
    console.log(response)

    res.sendStatus(200)
  } catch (error) {
    next(error)
    console.error(error)
  }
}

const updateSubscribe = async (req, res, next) => {
  try {
    const { user, endpoint, newSubscription } = req.body
    console.log('actualizando', req.body)

    // Actualizo la subscripcion
    const newSub = await Subscription.update(
      {
        keys: JSON.stringify(newSubscription.keys),
        endpoint: newSubscription.endpoint,
      },
      {
        where: { userId: user, endpoint: endpoint },
      }
    )
    console.log('Se actualizo la subscripcion', newSub)

    res.sendStatus(200)
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
  updateSubscribe,
}
