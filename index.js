const express = require('express')
const PORT = process.env.PORT || 6000
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/db')
const app = express()

const userRoutes = require('./api/routes/user')

// database config
mongoose.set('useCreateIndex', true)
mongoose
  .connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`[Database]: Connected successfully`)
  })
  .catch((err) => {
    console.log({ database_error: err })
  })

// other configs
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))

// routes
app.use('/user', userRoutes)
app.get('/', (req, res) => {
  res.send('Welcome to User Auth REST API')
})
//
app.listen(PORT, () => {
  console.log(`[Server]: Listening at ${PORT}`)
})
