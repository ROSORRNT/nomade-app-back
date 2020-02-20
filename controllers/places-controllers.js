const uuid = require('uuid/v4')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Musée du Louvre',
    description:
      "Le Louvre possède une longue histoire de conser vation artistique et historique, depuis l'Ancien Régime jusqu'à nos jours.",
    location: {
      lat: 48.860608,
      lng: 2.337642,
    },
    address: 'Rue de Rivoli, 75001 Paris',
    creator: 'u1',
  },
]

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid // { pid: 'p1' }
  const place = DUMMY_PLACES.find(p => p.id === placeId)

  if (!place) {
    const error = new HttpError(
      "Aucun lieu trouvé pour l'identifiant fourni.",
      404
    )
    // throw cancel the function execution, next() does not (so, return)
    return next(error)
  }

  res.json({ place })
}

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid
  const places = DUMMY_PLACES.filter(p => p.creator === userId)

  if (!places) {
    const error = new HttpError(
      "Aucun lieu trouvé pour l'identifiant utilisateur fourni.",
      404
    )
    return next(error)
  }
  res.json({ places })
}
// TODO : create and updatePlace => throw only for sychrone code
// Not assume that we get the coordinates from client (Geocoding)
const createPlace = (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    // console.log(error)
    // res.status(422)
    throw new HttpError(
      'Entrées de formulaire invalides, veuillez vérifiez vos données.',
      422
    )
  }
  const { title, description, coordinates, address, creator } = req.body

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  }

  DUMMY_PLACES.push(createdPlace)

  res.status(201).json({ place: createdPlace })
}

const updatePlaceById = (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    throw new HttpError(
      'Entrées de formulaire invalides, veuillez vérifiez vos données.',
      422
    )
  }
  const { title, description } = req.body
  const placeId = req.params.pid

  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).json({ place: updatedPlace })
}

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid
  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError("Aucun lieu trouvé pour l'identifiant fourni.", 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
  res.json({ message: 'Lieu supprimé' })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlaceById = deletePlaceById
