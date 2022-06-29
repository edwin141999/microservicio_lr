const express = require('express')
const router = express.Router()
const registerService = require('./register_service')

//PRISMA
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

router.post('/create', createUser)
router.get('/read', readUsers)
router.put('/update', updateUser)
router.delete('/delete', deleteUser)

function createUser(req, res, next) {
  const { first_name, last_name, email, password, phone_number, user_type, direccion, city_drive } = req.body
  registerService.registerUser(first_name, last_name, email, password, phone_number, user_type, direccion, city_drive)
    .then(user => user
      ? res.json(user)
      : res.status(400).json({ message: 'Email already exists' })
    )
    .catch(err => next(err))
}

async function readUsers(_req, res) {
  const users = await prisma.users.findMany()
  res.json(users)
}

async function updateUser(req, res) {
  const { email, password, phone_number } = req.body
  const users = await prisma.users.findMany()
  const user = users.find(u => u.email === email)
  if (user) {
    const newUser = await prisma.users.update({
      where: {
        id: user.id
      },
      data: {
        password: bcrypt.hashSync(password, 10),
        phone_number: phone_number
      }
    })
    res.json(newUser)
  }else{
    res.json('Correo electronico incorrecto')
  }
}

async function deleteUser(req, res) {
  const { email } = req.body
  const users = await prisma.users.findMany()
  const user = users.find(u => u.email === email)
  console.log(user);
  if (user) {
    await prisma.cliente.deleteMany({
      where: {
        user_id: user.id
      }
    })
    await prisma.users.deleteMany({
      where: {
        id: user.id
      }
    })
    res.json('Usuario eliminado')
  } else {
    res.json('Usuario no existe')
  }
}

module.exports = router