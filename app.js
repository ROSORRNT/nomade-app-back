const express = require('express')
const bodyParser = require('body-parser')

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

const app = express()

/* this will parse any incomming requests body, extract json data converted to regular JS, and then call next() automatically, so be reached the next middleware and then also add the json() data :
so, in createPlace (places-controllers) we are now able to get the parse body
 */
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

app.listen(5000)
