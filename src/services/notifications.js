const webpush = require('./webpushConfig')
const { Subscription, Notification } = require('../models')

const createNotification = async ({ message, url, receivers }) => {
  try {
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
    return results
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  createNotification,
}
