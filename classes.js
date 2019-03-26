class Article {
  constructor(key,user, title,url) {
    this.key = key
    this.user = user
    this.title = title
    this.url = url
  }
}

class Comment {
  constructor(key,user,blog,title,comment) {
  this.key = key
  this.user = user
  this.blog = blog
  this.title = title
  this.comment = comment
  }
}

class Blog {
  constructor(key,user,blogID,blogTitle,blogImg,blogContent) {
    this.key = key
    this.user = user
    this.blogID = blogID
    this.blogTitle = blogTitle
    this.blogImg = blogImg
    this.blogContent = blogContent
  }
}
