const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

async function registerUser(params) {
  // npx prisma db pull
  // npx prisma db push -> para hacer cambios en la base de datos
  // npm install @prisma/client
  // console.log(params);
  const { first_name, last_name, email, password, phone_number, user_type, direccion, latitud, longitud, city_drive } = params
  const user = await prisma.users.findMany()//buscar usuarios
  const existsEmail = user.some(u => u.email === email)//verificar que no exista el email
  let result = null
  if (existsEmail) {
    return null
  }
  if (user_type === 'Cliente' && !existsEmail) {
    result = await prisma.users.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        user_type: user_type,
        phone_number: phone_number,
        cliente: {
          create: {
            direccion: direccion,
            latitud: latitud,
            longitud: longitud,
          }
        },
        tipopago: {
          create: {
            metodo: 'Efectivo'
          }
        }
      },
      include: {
        reputacion: false
      }
    })
    // "first_name": "Edwin",
    // "last_name": "Astudillo de Coss",
    // "email": "gendevilman@gmail.com",
    // "password": "edwpatri2",
    // "phone_number": "9613600607",
    // "user_type": "Cliente",
    // "direccion": "17A. Ote Sur 941",
    // "latitud": "16.743445",
    // "longitud": "-93.1025933"
    return { user: result }
  } else {
    result = await prisma.users.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        phone_number: phone_number,
        user_type: user_type,
        repartidor: {
          create: {
            city_drive: city_drive,
            latitud: '',
            longitud: '',
            estado: 'No Disponible',
          }
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