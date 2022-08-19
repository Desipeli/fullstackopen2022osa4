const jwt = require('jsonwebtoken')
const config = require('../utils/config')


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = (request, response, next) => {
  
  request.user = 
    request.token 
    ? jwt.verify(request.token, config.SECRET) 
    : null
  
  next()
}

const unknownEndpoint = (request, response) => {
  console.log("unknown endpointt")
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  console.log("errorhandlerr")
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'wrong id format' })
  } else if (error.name === 'ValidationError') {
    console.log("Validation failed")
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}