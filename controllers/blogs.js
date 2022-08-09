const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = await new Blog(request.body)

  const savedBlog = blog.save(blog)
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter