const config = require('./lib/config')
const { Sequelize } = require('sequelize')

const { dbUser, dbPort, dbPassword, dbHost, dbName, isProduction, dbURL } =
  config

const conURI =
  dbURL || `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

let seqConfig = {
  logging: false, //isProduction !== 'production' ? false : false,
  native: false,
}

if (isProduction === 'production') {
  seqConfig = {
    ...seqConfig,
    pool: {
      max: 3,
      min: 1,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        // Ref.: https://github.com/brianc/node-postgres/issues/2009
        rejectUnauthorized: false,
      },
      keepAlive: true,
    },
    ssl: true,
  }
}

const sequelize = new Sequelize(conURI, seqConfig)

module.exports = {
  conn: sequelize,
}
