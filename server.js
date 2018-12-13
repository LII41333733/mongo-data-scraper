const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const request = require('request')
const cheerio = require('cheerio')
const exphbs = require('express-handlebars')

mongoose.Promise = Promise

// Controllers
const apiController = require('./controllers/apiController.js')
const htmlController = require('./controllers/htmlController.js')

// Initialize Express
const app = express()
const PORT = process.env.PORT || 3000
const mongoUrl = 'mongodb://localhost/pitchforkScrape'

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Use morgan and body parser with our app
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Make public a static dir
app.use(express.static('public'))

// Database configuration with mongoose
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
} else {
  mongoose.connect(mongoUrl)

}
const db = mongoose.connection

// Show any mongoose errors
db.on('error', function (error) {
  console.log('Mongoose Error: ', error)
})

db.once('open', function () {
  console.log('Mongoose connection successful.')
})

app.use('/', htmlController)
app.use('/api', apiController)

app.listen(PORT, function () {
  console.log(`App running on port ${PORT}!`)
})
