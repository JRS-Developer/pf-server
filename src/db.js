const config = require('./lib/config')
const { Sequelize } = require('sequelize')

const { dbUser, dbPort, dbPassword, dbHost, dbName, dev, dbURL } = config

const conURI =
  dbURL || `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

const sequelize = new Sequelize(conURI, {
  logging: dev ? console.log : false,
  native: false,
})

module.exports = {
  conn: sequelize,
}
