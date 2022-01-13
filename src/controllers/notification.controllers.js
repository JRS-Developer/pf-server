const Subscription = require('../models/Subscriptions')
const Notification = require('../models/Notification/Notification')
const UserNotification = require('../models/Notification/UserNotification')
const User = require('../models/User')
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
    const payload = JSON.stringify({
      title: 'Nueva subscripcion',
      body: `${user} se ha suscrito a las notificaciones`,
    })

    await webpush.sendNotification(sub, payload)

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
      include: [
        {
          model: User,
          where: { id: userId },
          attributes: [],
          through: {
            where: { status: true },
            attributes: [],
          },
        },
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    res.json(notifications)
  } catch (error) {
    next(error)
    console.error(error)
  }
}

const deleteNotifications = async (req, res, next) => {
  try {
    const { notificationsIds } = req.body
    const userId = res.locals.userId || req.body.userId
    console.log(req.body)
    console.log(userId)

    // Elimino las notificaciones
    let promises = notificationsIds.map(
      async (id) =>
        await UserNotification.update(
          { status: false },
          { where: { notificationId: id, userId } }
        )
    )

    await Promise.all(promises)

    res.status(200).json({ message: 'Notificaciones eliminadas' })
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
  createNotification,
  updateSubscribe,
  removeNotifications: deleteNotifications,
}
