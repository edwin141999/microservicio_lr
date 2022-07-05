const jwt = require('jsonwebtoken')
const config = require('../config.json')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

async function authenticate(email, password) {
  let user = null
  let dataType = null
  user = await prisma.users.findMany()//buscar usuarios
  user = user.filter(data => data.email === email)//filtrar por email
  if (user.length === 0) {
    return null
  }
  const valid = await bcrypt.compare(password, user[0].password);//validar contraseña
  if (valid) {
    // expiresIn expresado en segundos ->15min
    dataType = await prisma.cliente.findMany()
    const token = jwt.sign({ id: user[0].id }, config.privateKey, { expiresIn: config.tokenExpirySla })
    dataType = dataType.filter(data => data.user_id === user[0].id)
    console.log('TOKEN:', token);
    console.log('USER:', user[0]);
    console.log('DATA TYPE:', dataType);
    return { token: token, user: user[0], datatype: dataType }
  }
}

module.exports = { authenticate }