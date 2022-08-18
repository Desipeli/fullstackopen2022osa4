const config = require('./utils/config')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
require('express-async-errors')
const blogsRouter = require('./controllers/blogs')

const app = express()
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs',blogsRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app