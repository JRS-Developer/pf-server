const webpush = require('./webpushConfig')
const { Subscription, Notification } = require('../models')

const createNotification = async (message, url, receivers) => {
  try {
    // Creo la notificacion
    const newNotification = await Notification.create({ message, url })

    // Asigno los que van a recibir la notificacion
    await newNotification.setUsers(receivers)

    // Envio la notificacion a todos los receivers
    let promises = receivers.map(
      async (r) =>
        await Subscription.findAll(/* { where: { userId: r } } */).then(
          async (subs) => {
            return subs.map(async (sub) => {
              sub = sub.toJSON()
              sub = {...sub, keys: JSON.parse(sub.keys)}
              return await webpush.sendNotification(sub, message)
            })
          }
        )
    )

    const results = await Promise.allSettled(promises)
    console.log(results)
    return results
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  createNotification,
}
