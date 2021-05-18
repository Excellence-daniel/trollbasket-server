const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const port = 4020
// const config = require('./utils/config')[process.env.NODE_ENV || 'dev']
const config = require('./utils/config')
const morgan = require('morgan')

mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useNewUrlParser', true)
mongoose.connect(config.databaseurl)

const conn = mongoose.connection
conn.on('error', function (err) {
  console.log('mongoose connection error:', err.message)
})

const userRoutes = require('./routes/users')

app.use(morgan('dev'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.options('*', cors())
app.use(cors())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000') // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

app.listen(process.env.PORT || port, () => {
  console.log('Server started work on ' + port)
})

app.use('/users', userRoutes)
