const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('./routes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use('/api', routes)

module.exports = app
