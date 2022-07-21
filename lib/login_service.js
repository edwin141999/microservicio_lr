const jwt = require('jsonwebtoken')
const config = require('../config.json')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

async function authenticate(params) {
  const { email, password } = params
  let user = null
  let dataCliente = null
  let dataRepartidor = null
  let dataMetodoPago = null
  user = await prisma.users.findMany()//buscar usuarios
  user = user.filter(data => data.email === email)//filtrar por email
  if (user.length === 0) {
    return null
  }
  const valid = await bcrypt.compare(password, user[0].password);//validar contraseña
  if (valid) {
    // expiresIn expresado en segundos ->15min
    dataCliente = await prisma.cliente.findMany()
    dataRepartidor = await prisma.repartidor.findMany()
    dataMetodoPago = await prisma.tipopago.findMany()
    const token = jwt.sign({ id: user[0].id }, config.privateKey, { expiresIn: config.tokenExpirySla })
    if (user[0].user_type === 'Cliente') { //si es cliente
      dataCliente = dataCliente.filter(data => data.user_id === user[0].id)
      dataMetodoPago = dataMetodoPago.filter(data => data.user_id === user[0].id)
      return { token: token, user: user[0], datatype: dataCliente, metodoPago: dataMetodoPago }
    } else { //si es repartidor
      dataRepartidor = dataRepartidor.filter(data => data.user_id === user[0].id)
      return { token: token, user: user[0], datatype: dataRepartidor }
    }
  }
}

module.exports = { authenticate }