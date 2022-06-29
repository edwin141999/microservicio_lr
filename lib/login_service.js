const jwt = require('jsonwebtoken')
const config = require('../config.json')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');


async function authenticate(email, password) {
  let user = null
  user = await prisma.users.findMany()//buscar usuarios
  user = user.filter(data => data.email === email)//filtrar por email
  const valid = await bcrypt.compare(password, user[0].password);//validar contraseña
  if (valid) {
    // expiresIn expresado en segundos ->15min
    const token = jwt.sign({ id: user[0].id }, config.privateKey, { expiresIn: config.tokenExpirySla })
    console.log('TOKEN:', token);
    return { token: token }
  }
}

module.exports = { authenticate }