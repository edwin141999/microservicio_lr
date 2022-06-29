const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const authMiddleware = require('./lib/middleware');
const errorHandler = require('./lib/error_handler');

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use(authMiddleware)
app.use('/users', require('./lib/controller'))
app.use('/crud', require('./lib/crud_controller'))
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
