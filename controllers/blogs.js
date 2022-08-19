const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1, _id: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {

    const blog = await Blog.findById(request.params.id)
    response.json(blog)

})

blogsRouter.post('/', async (request, response, next) => {

  const body = request.body
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({error: 'missing or invalid token'})
  }
  const user = await User.findById(decodedToken.id)

  const blog = await new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })
    const savedBlog = await blog.save(blog)
    
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({ error: 'no blogs with given id'})
  }

  if (!request.token || blog.user.toString() !== decodedToken.id) {
    return response.status(401).json({error: 'missing or invalid token'})
  }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

    const updated = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true, runValidators: true})
    if (updated) {
      response.json(updated)
    } else {
      response.status(404).json({error: "no blogs with given id"})
    }
})

module.exports = blogsRouter