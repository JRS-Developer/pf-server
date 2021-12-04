const config = require('./lib/config')
const { Sequelize } = require('sequelize')

const { dbUser, dbPort, dbPassword, dbHost, dbName, dev } = config

const conURI = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

const sequelize = new Sequelize(conURI, {
  loggging: dev ? console.log : false,
  native: false,
})

module.exports = {
  conn: sequelize
}
