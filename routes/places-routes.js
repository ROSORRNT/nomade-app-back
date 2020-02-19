const express = require('express')

const placesControllers = require('../controllers/places-controllers')

const router = express.Router()

// ex: => api/places/p1
router.get('/:pid', placesControllers.getPlaceById)

router.get('/user/:uid', placesControllers.getPlacesByUserId)

router.post('/', placesControllers.createPlace)

router.patch('/:pid', placesControllers.updatePlaceById)

router.delete('/:pid', placesControllers.deletePlaceById)

module.exports = router
