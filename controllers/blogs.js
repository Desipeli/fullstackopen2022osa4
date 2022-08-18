const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {

  const blog = await new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0
  })

  try {
    const savedBlog = await blog.save(blog)
    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }
  
})

module.exports = blogsRouter