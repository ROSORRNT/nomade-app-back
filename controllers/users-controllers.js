const uuid = require('uuid/v4')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Romain Sorrenti',
    email: 'test@test.com',
    password: 'testers',
  },
]

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS })
}

const signup = (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    throw new HttpError(
      'Entrées de formulaire invalides, veuillez vérifiez vos données.',
      422
    )
  }
  const { name, email, password } = req.body

  const hasUser = DUMMY_USERS.find(u => u.email === email)

  if (hasUser) {
    const error = new HttpError(
      'Cet email est déjà utilisé par un autre utilisateur.',
      422
    )
    return next(error)
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  }

  DUMMY_USERS.push(createdUser)

  res.status(201).json({ user: createdUser })
}

const login = (req, res, next) => {
  const { email, password } = req.body

  const identifiedUser = DUMMY_USERS.find(u => u.email === email)
  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new HttpError(
      "L'utilisateur n'a pu être identifié, les informations d'identification semblent erronées.",
      401
    )
    return next(error)
  }
  res.json({ message: 'Login' })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
