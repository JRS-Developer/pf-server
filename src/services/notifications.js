const webpush = require('./webpushConfig')
const { Subscription, Notification } = require('../models')
const { cors: web } = require('../lib/config')

// message: string que contiene el mensaje a enviar
// url: string que contiene la url relativo a la cual se enviara el mensaje, ej: /tasks/1, /materias/1
// receivers: array de strings uuid de los usuarios a los que se enviara el mensaje
const createNotification = async ({ title, message, url, receivers }) => {
  try {
    // Creo la notificacion
    const newNotification = await Notification.create({ message, url, title })

    // Envio las notificaciones
    await sendNotification({
      message,
      url,
      receivers,
      title,
    })

    // Asigno los que van a recibir la notificacion
    await newNotification.setUsers(receivers)
  } catch (error) {
    console.error(error)
    throw error
  }
}

const sendNotification = async ({ title, message, url, receivers }) => {
  try {
    const payload = JSON.stringify({
      title,
      message,
      url: url ? `${web}/${url}` : null,
    })

    console.log('payload', payload)
    // Envio la notificacion a todos los receivers
    let promises = receivers.map(
      async (r) =>
        await Subscription.findAll({ where: { userId: r } }).then(
          async (subs) => {
            return Promise.allSettled(
              subs.map((sub) => {
                sub = sub.toJSON()
                sub = { ...sub, keys: JSON.parse(sub.keys) }
                return webpush.sendNotification(sub, payload)
              })
            )
              .then((results) => {
                console.log('exitos', results)
                results.forEach((result) => {
                  if (result.status === 'rejected') {
                    console.log(result.reason)
                  }
                })
              })
              .catch((err) => {
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
