const listHelper = require('../utils/list_helper')

const listWithNoBlogs = []

const listWithOneBlog = [
  {
    "_id": "62f0eefc39426be624cb93be",
    "title": "Titteli",
    "author": "Autori",
    "url": "urli",
    "likes": 10,
    "__v": 0
    },
]

const listWithSixBlogs = [
  {
    "_id": "62f0eefc39426be624cb93be",
    "title": "Titteli",
    "author": "Autori",
    "url": "urli",
    "likes": 10,
    "__v": 0
    },
    {
    "_id": "62f0efc039426be624cb93c1",
    "title": "Titteli2",
    "author": "Autori2",
    "url": "urli2",
    "likes": 20,
    "__v": 0
    },
    {
    "_id": "62f0f2ddd76ae5de70b92026",
    "title": "Titteli3",
    "author": "Autori3",
    "url": "urli3",
    "likes": 30,
    "__v": 0
    },
    {
    "_id": "62f0f642d0586bbd4cd24ae5",
    "title": "Titteli4",
    "author": "Autori4",
    "url": "urli4",
    "likes": 40,
    "__v": 0
    },
    {
    "_id": "62f0fa027d269e8ba3d667c2",
    "title": "Titteli5",
    "author": "Autori5",
    "url": "urli5",
    "likes": 50,
    "__v": 0
    },
    {
    "_id": "62f0fd46bbe863944f8f04a2",
    "title": "Titteli6",
    "author": "Autori6",
    "url": "urli6",
    "likes": 60,
    "__v": 0
    }
]

const listWithMostLikesFirst = [
  {
    "_id": "62f0fd46bbe863944f8f04a2",
    "title": "Titteli6",
    "author": "Autori6",
    "url": "urli6",
    "likes": 60,
    "__v": 0
  },
  {
    "_id": "62f0f642d0586bbd4cd24ae5",
    "title": "Titteli4",
    "author": "Autori4",
    "url": "urli4",
    "likes": 40,
    "__v": 0
  },
  {
    "_id": "62f0fa027d269e8ba3d667c2",
    "title": "Titteli5",
    "author": "Autori5",
    "url": "urli5",
    "likes": 50,
    "__v": 0
  },
]
const listContainingSameAuthors = [
  {
    "_id": "62f0fd46bbe863944f8f0422",
    "title": "asdf",
    "author": "Autori",
    "url": "urli6",
    "likes": 40,
    "__v": 0
  },
  {
    "_id": "22f0fd46bbe863944f8f0422",
    "title": "qwerty",
    "author": "Autori",
    "url": "urli6",
    "likes": 40,
    "__v": 0
  },
  {
    "_id": "32f0fd46bbe863944f8f0422",
    "title": "aaaaf",
    "author": "Autori2",
    "url": "urli6",
    "likes": 40,
    "__v": 0
  },
  {
    "_id": "42f0fd46bbe863944f8f0422",
    "title": "aqqqqf",
    "author": "Autori2",
    "url": "urli6",
    "likes": 40,
    "__v": 0
  },
  {
    "_id": "52f0fd46bbe863944f8f0422",
    "title": "wwwwwf",
    "author": "Autori",
    "url": "urli6",
    "likes": 40,
    "__v": 0
  },
  {
    "_id": "72f0fd46bbe863944f8f0422",
    "title": "ffffwf",
    "author": "Autori3",
    "url": "urli6",
    "likes": 40,
    "__v": 0
  },
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(10)
  })

  test('when list has six blogs are calculated right', () => {
    const result = listHelper.totalLikes(listWithSixBlogs)
    expect(result).toBe(210)
  })

  test('when list is empty is zero', () => {
    const result = listHelper.totalLikes(listWithNoBlogs)
    expect(result).toBe(0)
  })
})
describe('favourite blog', () => {

  test('when list is empty is null', () => {
    const result = listHelper.favouriteBlog(listWithNoBlogs)
    expect(result).toBe(null)
  })

  test('with list containing only one blog', () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    expect(result).toEqual({
      "title": "Titteli",
      "author": "Autori",
      "likes": 10
    })
  })

  test('is last one with multiple blogs', () => {
    const result = listHelper.favouriteBlog(listWithSixBlogs)
    expect(result).toEqual({
      "title": "Titteli6",
      "author": "Autori6",
      "likes": 60
    })
  })

  test('is first one with multiple blogs', () => {
    const result = listHelper.favouriteBlog(listWithMostLikesFirst)
    expect(result).toEqual({
      "title": "Titteli6",
      "author": "Autori6",
      "likes": 60
    })
  })
})
describe('most blogs', () => {

  test('no blogs', () => {
    const result = listHelper.mostBlogs(listWithNoBlogs)
    expect(result).toEqual(null)
  })

  test('one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({
      "author": "Autori",
      "blogs": 1
    })
  })

  test('multiple blogs, all different authors. Return first', () => {
    const result = listHelper.mostBlogs(listWithSixBlogs)
    expect(result).toEqual({
      "author": "Autori",
      "blogs": 1
    })
  })

  test('six blogs from three authors', () => {
    const result = listHelper.mostBlogs(listContainingSameAuthors)
    expect(result).toEqual({
      "author": "Autori",
      "blogs": 3
    })
  })
})

describe('most likes', () => {

  test('no blogs', () => {
    const result = listHelper.mostLikes(listWithNoBlogs)
    expect(result).toEqual(null)
  })

  test('one blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({
      "author": "Autori",
      "likes": 10,
    })
  })

  test('multiple blogs, different authors. Most likes last', () => {
    const result = listHelper.mostLikes(listWithSixBlogs)
    expect(result).toEqual({
      "author": "Autori6",
      "likes": 60,
    })
  })

  test('multiple blogs, different authors. Most likes first', () => {
    const result = listHelper.mostLikes(listWithMostLikesFirst)
    expect(result).toEqual({
      "author": "Autori6",
      "likes": 60,
    })
  })

  test('six blogs by three authors, 3, 2, 1', () => {
    const result = listHelper.mostLikes(listContainingSameAuthors)
    expect(result).toEqual({
      "author": "Autori",
      "likes": 120,
    })
  })
})
