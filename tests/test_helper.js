const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "Titteli",
    "author": "Autori",
    "url": "urli",
    "likes": 10,
    "user": "12ji12d12d",
  },
  {
    "title": "Titteli2",
    "author": "Autori2",
    "url": "urli2",
    "likes": 20,
    "user": "12ji12d12d",
  },
  {
    "title": "Titteli3",
    "author": "Autori3",
    "url": "urli3",
    "likes": 30,
  },
  {
    "title": "Titteli4",
    "author": "Autori4",
    "url": "urli4",
    "likes": 40,
  },
  {
    "title": "Titteli5",
    "author": "Autori5",
    "url": "urli5",
    "likes": 50,
  },
  {
    "title": "Titteli6",
    "author": "Autori6",
    "url": "urli6",
    "likes": 60,
  }
]

const singleBlog = {
  title: "otsikko",
  author: "kirjoittaja",
  url: "urli6",
  likes: 11
}

const singleBlogNoLikes = {
  title: "ei tykkäyksiä",
  author: "surku",
  url: "urli6",
  likes: "",
}

const blogNoTitle = {
  title: "",
  author: "noTitle",
  url: "urli123",
  likes: "0",
}

const blogNoUrl = {
  title: "noUrl",
  author: "kirjoittaja",
  url: "",
  likes: 11
}

const user1 = {
  "username": "käyttäjä",
  "name": "keijo käyttäjä",
  "password": "salasana"
}

const user2 = {
  "username": "aaa",
  "name": "aaa aaa",
  "password": "aaa"
}

module.exports = {
  initialBlogs,
  singleBlog,
  singleBlogNoLikes,
  blogNoTitle,
  blogNoUrl,

  user1,
  user2
}