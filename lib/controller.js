const express = require('express');
const router = express.Router()
const loginService = require('./login_service')
const registerService = require('./register_service')

router.post('/login', loginUser)
router.post('/register', registerUser)

function loginUser(req, res, next) {
  const { email, password } = req.body
  loginService.authenticate(email, password)
    .then(result => result
      ? res.json(result)
      : res.status(400).json({ message: 'Email or password is incorrect' })
    ).catch(err => next(err))
}

function registerUser(req, res, next) {
  const { first_name, last_name, email, password, phone_number, user_type, direccion, city_drive } = req.body
  registerService.registerUser(first_name, last_name, email, password, phone_number, user_type, direccion, city_drive)
    .then(user => user
      ? res.json(user)
      : res.status(400).json({ message: 'Email already exists' })
    )
    .catch(err => next(err))
}

module.exports = router