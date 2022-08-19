const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let token1 = "moi"
let token2 = "hei"
describe('when there are blogs in the database', () => {


  beforeEach(async () => {

    await User.deleteMany({})
    const user1 = helper.user1
    await api.post('/api/users')
      .set('Content-Type', 'application/json')
      .send(user1)
    
    const login1 = await api.post('/api/login')
        .set('Content-Type', 'application/json')
        .send({ username: helper.user1.username, password: helper.user1.password})

    token1 = login1.body.token

    const user2 = helper.user2
    await api.post('/api/users')
      .set('Content-Type', 'application/json')
      .send(user2)
    
    const login2 = await api.post('/api/login')
        .set('Content-Type', 'application/json')
        .send({ username: helper.user2.username, password: helper.user2.password})
      
      token2 = login2.body.token

    await Blog.deleteMany({})

    const saveBlogs = helper.initialBlogs
      .map(blog => ({...blog, user: helper.user1.id}))
      for (const blog of saveBlogs) {
        await api.post('/api/blogs')
          .set('Authorization', `Bearer ${token1}`)
          .send(blog)
      }

  })

  describe('get', () => {
    test('all blogs, check that type is application/json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  
    test('correct amount of blogs', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(6)
    })
  
    test('all blogs, check that id field exists', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
    })

    test('single blog by id', async () => {
      const response = await api.get('/api/blogs')
      const firstBlog = response.body[0]

      const resBlog = await api.get(`/api/blogs/${firstBlog.id}`)
      expect(resBlog.body.id).toBe(firstBlog.id)
      expect(resBlog.body.title).toBe(firstBlog.title)
      expect(resBlog.body.url).toBe(firstBlog.url)
    })

  })

  describe('post blog', () => {

    test('and verify it was saved in db', async () => {

      const newBlog = helper.singleBlog
      const postedBlog = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token1}`)
        .send(newBlog)
      console.log(postedBlog.body)
  
      expect(postedBlog.status).toBe(201)
  
      const response = await api.get('/api/blogs')
      expect(response.body[6].title).toBe('otsikko')
      expect(response.body[6].author).toBe('kirjoittaja')
      expect(response.body[6].likes).toBe(11)
      expect(response.body).toHaveLength(7)
  
    })

    test('without likes, should be zero', async () => {
      const newBlog = helper.singleBlogNoLikes
      const postedBlog = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token1}`)
        .send(newBlog)

      expect(postedBlog.status).toBe(201)

      const response = await api.get('/api/blogs')
      expect(response.body[6].likes).toBe(0)
    })

    test('without title, return 400', async () => {
      const newBlog = helper.blogNoTitle
      const postedBlog = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token1}`)
        .send(newBlog)

      expect(postedBlog.status).toBe(400)
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(6)
    })

    test('without url, return 400', async () => {
      const newBlog = helper.blogNoUrl
      const postedBlog = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token1}`)
        .send(newBlog)

      expect(postedBlog.status).toBe(400)
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(6)
    })

    test('without token, fail 401', async () => {
      const newBlog = helper.singleBlog
      const postedBlog = await api.post('/api/blogs')
        .send(newBlog)

      expect(postedBlog.status).toBe(401)
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(6)
    })

    test('with invalid token, fail 401', async () => {
      const newBlog = helper.singleBlog
      const postedBlog = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token1}123`)
        .send(newBlog)

      expect(postedBlog.status).toBe(401)
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(6)
    })
  })

  describe('delete', () => {

    test('first blog', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(6)
      const firstBlog = response.body[0]

      const deleted = await api.delete(`/api/blogs/${firstBlog.id}`)
        .set('Authorization', `Bearer ${token1}`)
      expect(deleted.status).toBe(204)

      const remainingBlogs = await api.get('/api/blogs')
      expect(remainingBlogs.body).toHaveLength(5)

    })

    test('blog from another user, fail and return 401', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(6)
      const firstBlog = response.body[0]

      const deleted = await api.delete(`/api/blogs/${firstBlog.id}`)
        .set('Authorization', `Bearer ${token2}`)
      expect(deleted.status).toBe(401)

      const remainingBlogs = await api.get('/api/blogs')
      expect(remainingBlogs.body).toHaveLength(6)

    })
  })

  describe('modify', () => {

    test('likes of a blog', async () => {
      const response = await api.get('/api/blogs')
      const firstBlog = response.body[0]

      const newBlog = {
        likes: 2000
      }

      await api.put(`/api/blogs/${firstBlog.id}`).send(newBlog)
      const getModified = await api.get(`/api/blogs/${firstBlog.id}`)
      expect(getModified.body.likes).toBe(2000)

    })

    test('all fields', async () => {
      const response = await api.get('/api/blogs')
      const secondBlog = response.body[1]

      const newBlog = {
        title: "uusi Titteli",
        author: "uusi Autori",
        url: "uusi URLI",
        likes: 9001
      }

      await api.put(`/api/blogs/${secondBlog.id}`).send(newBlog)
      const returnedBlog = await api.get(`/api/blogs/${secondBlog.id}`)
      expect(returnedBlog.body.likes).toBe(9001)
      expect(returnedBlog.body.title).toBe(newBlog.title)
      expect(returnedBlog.body.author).toBe(newBlog.author)
      expect(returnedBlog.body.url).toBe(newBlog.url)
    })

    test('add empty title, will fail', async () => {
      const response = await api.get('/api/blogs')
      const secondBlog = response.body[1]

      const newBlog = {
        title: "",
        likes: 9001
      }

      const returnedBlog = await api.put(`/api/blogs/${secondBlog.id}`).send(newBlog)
      expect(returnedBlog.status).toBe(400)

      const getSecond = await api.get(`/api/blogs/${secondBlog.id}`)
      expect(getSecond.body.title).not.toBe("")
    })

    test('add empty url, will fail', async () => {
      const response = await api.get('/api/blogs')
      const secondBlog = response.body[1]

      const newBlog = {
        url: "",
        likes: 9001
      }

      const returnedBlog = await api.put(`/api/blogs/${secondBlog.id}`).send(newBlog)
      expect(returnedBlog.status).toBe(400)

      const getSecond = await api.get(`/api/blogs/${secondBlog.id}`)
      expect(getSecond.body.url).not.toBe("")
    })
  })

})

afterAll(() => {
  mongoose.connection.close()
})