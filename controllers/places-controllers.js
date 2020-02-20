const uuid = require('uuid/v4')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid // { pid: 'p1' }

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      "Quelque chose s'est mal passé, aucun lieu trouvé.",
      500
    )
    return next(error)
  }

  if (!place) {
    const error = new HttpError(
      "Aucun lieu trouvé pour l'identifiant fourni.",
      404
    )
    return next(error)
  }

  res.json({ place: place.toObject({ getters: true }) })
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid
  let places
  try {
    places = await Place.find({ creator: userId })
  } catch (err) {
    const error = new HttpError(
      "Quelque chose s'est mal passé, aucun lieu trouvé.",
      500
    )
    return next(error)
  }

  if (!places || places.length === 0) {
    const error = new HttpError(
      "Aucun lieu trouvé pour l'identifiant utilisateur fourni.",
      404
    )
    return next(error)
  }
  // getters to make sure that the underscore from our id prop is remove
  res.json({ places: places.map(p => p.toObject({ getters: true })) })
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description, address, creator } = req.body

  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://comprendrelapeinture.com/wp-content/uploads/2016/10/louvre.jpg',
    creator,
  })

  try {
    await createdPlace.save()
  } catch (err) {
    const error = new HttpError(
      "L'opération de création du lieu à échouée, veuillez réessayer.",
      500
    )
    return next(error)
  }

  res.status(201).json({ place: createdPlace })
}

const updatePlaceById = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    throw new HttpError(
      'Entrées de formulaire invalides, veuillez vérifiez vos données.',
      422
    )
  }
  const { title, description } = req.body
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      "Quelque chose s'est mal passé, le lieu n'a pu être édité.",
      500
    )
    return next(error)
  }

  place.title = title
  place.description = description

  try {
    await place.save()
  } catch (err) {
    const error = new HttpError(
      "Quelque chose s'est mal passé, le lieu n'a pu être édité.",
      500
    )
    return next(error)
  }

  res.status(200).json({ place: place.toObject({ getters: true }) })
}

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      "L'opération de suppression du lieu à échouée, veuillez réessayer.",
      500
    )
    return next(error)
  }

  try {
    await place.remove()
  } catch (err) {
    const error = new HttpError(
      "L'opération de suppression du lieu à échouée, veuillez réessayer.",
      500
    )
    return next(error)
  }

  res.json({ message: 'Lieu supprimé' })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlaceById = deletePlaceById
