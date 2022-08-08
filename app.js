const config = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const blogsRouter = require('./controllers/blogs')

const app = express()
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs',blogsRouter)

module.exports = app