const config = require('./lib/config')
const { Sequelize } = require('sequelize')

const { dbUser, dbPort, dbPassword, dbHost, dbName, isProduction, dbURL } = config

const conURI =
  dbURL || `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`

// const sequelize = new Sequelize(conURI, {
//   logging: dev ? console.log : false,
//   native: false,
// })

let sequelize =
  isProduction === "production"
    ? new Sequelize({
        database: dbName,
        dialect: "postgres",
        host: dbHost,
        port: 5432,
        username: dbUser,
        password: dbPassword,
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
      })
    : new Sequelize(
        conURI,
        { logging: false, native: false }
      );


module.exports = {
  conn: sequelize,
}
