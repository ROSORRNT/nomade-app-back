const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placesRoutes) // => app/places/...
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
  const error = new HttpError("Cette route n'a pu être trouvée.", 404)
  return next(error)
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || "Une erreur inconnue s'est produite." })
})

mongoose
  .connect(
    'mongodb+srv://rosorrnti:Romainsorrenti06@cluster0-powk1.mongodb.net/places?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(5000)
  })
  .catch(err => console.log(err))
