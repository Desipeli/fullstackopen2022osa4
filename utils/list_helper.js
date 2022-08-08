const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)

  return total
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0 ) return null

  const favourite = blogs.reduce((previouse, current) => {
    return previouse.likes > current.likes ? previouse : current
  }, blogs[0])

  return {
    "title": favourite.title,
    "author": favourite.author,
    "likes": favourite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0 ) return null
  let authors = {}
  let maxAuthor = {
    "author": "",
    "blogs": 0,
  }

  blogs.forEach(blog => {
    author = blog.author
    authors[author] = authors[author] + 1 || 1

    if (authors[author] > maxAuthor.blogs) {
      maxAuthor.author = author
      maxAuthor.blogs = authors[author]
    }
  })
  return maxAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0 ) return null
  let authors = {}
  let maxAuthor = {
    "author": "",
    "likes": 0,
  }
  
  blogs.forEach(blog => {
    author = blog.author
    authors[author] = authors[author] + blog.likes || blog.likes

    if (authors[author] > maxAuthor.likes) {
      maxAuthor.author = author
      maxAuthor.likes = authors[author]
    }
  })
  return maxAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}