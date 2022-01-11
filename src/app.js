const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('./routes')
const config = require('./lib/config')
const server = require('./services')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(
  cors({
    origin: config.cors,
  })
)
app.use(helmet())
app.use('/files', express.static('files'))
app.use('/webpush', server)
app.use('/api', routes)

module.exports = app
