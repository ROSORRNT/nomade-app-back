const express = require('express')

const router = express.Router()

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Musée du Louvre',
    description:
      "Le Louvre possède une longue histoire de conservation artistique et historique, depuis l'Ancien Régime jusqu'à nos jours.",
    location: {
      lat: 48.860608,
      lng: 2.337642,
    },
    address: 'Rue de Rivoli, 75001 Paris',
    creator: 'u1',
  },
]
// ex: => api/places/p1
router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid // { pid: 'p1' }
  const place = DUMMY_PLACES.find(p => p.id === placeId)

  res.json({ place })
})

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid

  const place = DUMMY_PLACES.find(p => p.creator === userId)

  res.json({ place })
})

module.exports = router
