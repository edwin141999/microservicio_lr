function errorHandler(err, _req, res, _next) {
  if (typeof (err) === 'string') {
    return res.status(400).json({ message: err })
  }

  return res.status(500).json({ message: err.message })
}

module.exports = errorHandler
