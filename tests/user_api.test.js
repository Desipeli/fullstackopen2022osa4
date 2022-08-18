const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('User tests', () => {

  beforeEach(async () => {
    await User.deleteMany({})

  })

  describe('try to add user', () => {

    test('with correct values', async () => {
      const user = helper.user1

      const response = await api.post('/api/users').send(user)
      expect(response.status).toBe(201)

      const users = await api.get('/api/users')
      expect(users.body[0].username).toBe(user.username)
      expect(users.body[0].name).toBe(user.name)
      expect(users.body).toHaveLength(1)
    })

    test('with empty username', async () => {
      const user = {...helper.user1, username:""}
      console.log(user)

      const response = await api.post('/api/users').send(user)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe("User validation failed: username: required and must be at least 3 characters long")

      const users = await api.get('/api/users')
      expect(users.body).toHaveLength(0)
    })

    test('with empty password', async () => {
      const user = {...helper.user1, password:""}

      const response = await api.post('/api/users').send(user)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe("password must be at least 3 characters long")

      const users = await api.get('/api/users')
      expect(users.body).toHaveLength(0)
    })

    test('with too short username', async () => {
      const user = {...helper.user1, username:"ab"}

      const response = await api.post('/api/users').send(user)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe("User validation failed: username: must be at least 3 characters long")

      const users = await api.get('/api/users')
      expect(users.body).toHaveLength(0)
    })

    test('with too short password', async () => {
      const user = {...helper.user1, password:"ab"}

      const response = await api.post('/api/users').send(user)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe("password must be at least 3 characters long")

      const users = await api.get('/api/users')
      expect(users.body).toHaveLength(0)
    })

    test('without username', async () => {
      const user = {name: "nimi", password: "kukkuluuruu"}

      const response = await api.post('/api/users').send(user)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe("User validation failed: username: required and must be at least 3 characters long")

      const users = await api.get('/api/users')
      expect(users.body).toHaveLength(0)
    })

    test('without password', async () => {
      const user = {username:"unimi" ,name: "nimi"}

      const response = await api.post('/api/users').send(user)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe("password must be at least 3 characters long")

      const users = await api.get('/api/users')
      expect(users.body).toHaveLength(0)
    })

    test('with username already in database', async () => {
      const user = {username:"unimi" ,name: "nimi", password: "salis"}
      const response = await api.post('/api/users').send(user)
      expect(response.status).toBe(201)

      const response2 = await api.post('/api/users').send(user)
      expect(response2.status).toBe(400)
      expect(response2.body.error).toBe('username must be unique')
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})