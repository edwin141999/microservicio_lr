const express = require('express');
const router = express.Router()
const loginService = require('./login_service')
const registerService = require('./register_service')

router.post('/login', loginUser)
router.post('/register', registerUser)

function loginUser(req, res, next) {
  loginService.authenticate(req.body)
    .then(result => result
      ? res.json(result)
      : res.status(400).json({ message: 'Email or password is incorrect' })
    ).catch(err => next(err))
}

function registerUser(req, res, next) {
  if (req.body === '') {
    return res.status(400).json({ message: 'Some field/s is empty' })
  }
  registerService.registerUser(req.body)
    .then(user => user
      ? res.json(user)
      : res.status(400).json({ message: 'Email already exists' })
    )
    .catch(err => next(err))
}

module.exports = router