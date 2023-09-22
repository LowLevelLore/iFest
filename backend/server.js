'use strict'

var express = require('express')
const app = express()
const mongoose = require('mongoose')
const Task = require('./api/models/todoListModel')
const User = require('./api/models/userModel')
const bodyParser = require('body-parser')
const jsonwebtoken = require('jsonwebtoken')

require('dotenv').config()

const port = process.env.PORT || 3000
mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))

app.use(function (req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT'
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(' ')[1],
      'RESTFULAPIs',
      function (err, decode) {
        if (err) req.user = undefined
        req.user = decode
        next()
      },
    )
  } else {
    req.user = undefined
    next()
  }
})
var routes = require('./api/routes/todoListRoutes')
routes(app)

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
})

app.listen(port, process.env.HOST)

console.log(
  'todo list RESTful API server started on: ' + process.env.HOST + ':' + port,
)

module.exports = app
