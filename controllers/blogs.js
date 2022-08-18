const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {

    const blog = await Blog.findById(request.params.id)
    response.json(blog)

})

blogsRouter.post('/', async (request, response, next) => {

  const blog = await new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0
  })

    const savedBlog = await blog.save(blog)
    response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response, next) => {
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