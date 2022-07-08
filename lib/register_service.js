const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

async function registerUser(...params) {
  // npx prisma db pull
  // npx prisma db push -> para hacer cambios en la base de datos
  // npm install @prisma/client
  // console.log(params);
  const user = await prisma.users.findMany()//buscar usuarios
  const existsEmail = user.some(u => u.email === params[2])//verificar que no exista el email
  let result = null
  if (existsEmail) {
    return null
  }
  if (params[5] === 'Cliente' && !existsEmail) {
    result = await prisma.users.create({
      data: {
        first_name: params[0],
        last_name: params[1],
        email: params[2],
        password: bcrypt.hashSync(params[3], 10),
        phone_number: params[4],
        user_type: params[5],
        cliente: {
          create: {
            direccion: params[6]
          }
        }
      },
      include: {
        tipopago: false,
        reputacion: false
      }
    })
    return { user: result }
  } else {
    result = await prisma.users.create({
      data: {
        first_name: params[0],
        last_name: params[1],
        email: params[2],
        password: bcrypt.hashSync(params[3], 10),
        phone_number: params[4],
        user_type: params[5],
        repartidor: {
          create: { city_drive: params[7], estado: 'No Disponible' }
        }
      },
      include: {
        tipopago: false,
        reputacion: false
      }
    })
    return { user: result }
  }
}

module.exports = { registerUser }