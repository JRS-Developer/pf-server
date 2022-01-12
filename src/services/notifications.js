const webpush = require('./webpushConfig')
const { Subscription, Notification } = require('../models')

// message: string que contiene el mensaje a enviar
// url: string que contiene la url a la que se enviara el mensaje
// receivers: array de strings uuid de los usuarios a los que se enviara el mensaje
const createNotification = async (message, url, receivers) => {
  try {
    // Creo la notificacion
    const newNotification = await Notification.create({ message, url })

    // Asigno los que van a recibir la notificacion
    await newNotification.setUsers(receivers)

    // Envio la notificacion a todos los receivers
    let promises = receivers.map(
      async (r) =>
        await Subscription.findAll({ where: { userId: r } }).then(
          async (subs) => {
            return Promise.allSettled(
              subs.map((sub) => {
                sub = sub.toJSON()
                sub = { ...sub, keys: JSON.parse(sub.keys) }
                console.log('sub', sub)
                return webpush.sendNotification(sub, message)
              })
            ).then((results) => {
              console.log('exitos', results)
              results.forEach((result) => {
                if (result.status === 'rejected') {
                  console.log(result.reason)
                }
              })
            }).catch((err) => {
              console.error('error linea 30', err)
            })
          }
        )
    )

    let results = await Promise.allSettled(promises)
    return results
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  createNotification,
}
