const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const port = 4020
const config = require('./utils/config')[process.env.NODE_ENV || 'dev']
// const config = require('./utils/config')
const morgan = require('morgan')

app.options('*', cors())
app.use(cors())

mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useNewUrlParser', true)
mongoose.connect(config.databaseurl)

const conn = mongoose.connection
conn.on('error', function (err) {
  console.log('mongoose connection error:', err.message)
})

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested, Content-Type, Accept Authorization',
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE')
    return res.status(200).json({})
  }
  next()
})
app.use(cors({ origin: '*', credentials: true }))

const userRoutes = require('./routes/users')

app.listen(process.env.PORT || port, () => {
  console.log('Server started work on ' + port)
})

app.use('/users', userRoutes)
