const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(6)
})

test('blog contains id field', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('post single blog and verify', async () => {
  const newBlog = helper.singleBlog
  const postedBlog = await api.post('/api/blogs').send(newBlog)

  expect(postedBlog.status).toBe(201)

  const response = await api.get('/api/blogs')
  expect(response.body[6].title).toBe('otsikko')
  expect(response.body[6].author).toBe('kirjoittaja')
  expect(response.body[6].likes).toBe(11)
  expect(response.body).toHaveLength(7)

})

test('post blog without likes, should be zero', async () => {
  const newBlog = helper.singleBlogNoLikes
  const postedBlog = await api.post('/api/blogs').send(newBlog)

  expect(postedBlog.status).toBe(201)

  const response = await api.get('/api/blogs')
  expect(response.body[6].likes).toBe(0)
})

test('post blog without title, return 400', async () => {
  const newBlog = helper.blogNoTitle
  const postedBlog = await api.post('/api/blogs').send(newBlog)

  expect(postedBlog.status).toBe(400)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(6)
})

test('post blog without url, return 400', async () => {
  const newBlog = helper.blogNoUrl
  const postedBlog = await api.post('/api/blogs').send(newBlog)

  expect(postedBlog.status).toBe(400)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(6)
})

afterAll(() => {
  mongoose.connection.close()
})