let database = firebase.database()
let myUserId = ''
let users = []
let savedArticles = []
let comments = []
let blogs = []
let admin = "False"
let signInUser = document.getElementById('signInUser')
let signUpUser = document.getElementById('signUpUser')
let signOut = document.getElementById('signOut')
let news = document.getElementById("news")
let submitBtn = document.getElementById("submitBtn")
let zipInput = document.getElementById("zipInput")
let zippers = 77002
let imageURL = ""

document.getElementById('blogEntry').style.display = "none";

window.onload=loadData(zippers)

database.ref("articles")
.on("child_added",function(snapshot){
  let article = new Article(snapshot.key,snapshot.val().user,snapshot.val().title,snapshot.val().url)
  savedArticles.push(article)
})

database.ref("articles")
.on("child_removed",function(snapshot){
    savedArticles = savedArticles.filter((article) => {
      return article.key != snapshot.key
    })
})

database.ref("comments")
.on("child_added",function(snapshot){
  let comment = new Comment(snapshot.key,snapshot.val().user,snapshot.val().blog,snapshot.val().title,snapshot.val().comment)
  comments.push(comment)
})

database.ref("comments")
.on("child_removed",function(snapshot){
    comments = comments.filter((comment) => {
      return comment.key != snapshot.key
    })
})

database.ref("blogs")
.on("child_added",function(snapshot){
  let blog = new Blog(snapshot.key,snapshot.val().user,snapshot.val().blogID,snapshot.val().blogTitle,snapshot.val().blogImg,snapshot.val().blogContent)
  blogs.push(blog)
})

database.ref("blogs")
.on("child_removed",function(snapshot){
    blogs = blogs.filter((blog) => {
      return blog.key != snapshot.key
    })
})

signInUser.addEventListener('click',function() {
  let emailAddress = document.getElementById('signInEmailAddress').value
  let password = document.getElementById('signInPassword').value
  firebase.auth().signInWithEmailAndPassword(emailAddress, password).catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      })
      // ...
  getUID()

})

signUpUser.addEventListener('click',function() {
  let emailAddress = document.getElementById('signUpEmailAddress').value
  let password = document.getElementById('signUpPassword').value
  userName(emailAddress,password)
  firebase.auth().createUserWithEmailAndPassword(emailAddress,password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
        console.log(error);
      })
})

signOut.addEventListener('click',function(){
  firebase.auth().signOut().then(function() {
    location.reload().then(function(){}).catch(function(error) {
  });
})
})

firebase.auth().onAuthStateChanged(function(user) {
    window.user = user;
    })

    function getUID() {
        var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified;
        return user.uid
    }

    function adminCheck() {
      if (user != null) {
        if (user.uid == "78I5hgvWUzVGLpfNUOzEOyTlH8F3" || "FCIAB6mUByZ0w7EHOswbpBxk1n32" || "WoascjVSpNYYB9pFUgbNGvuswor1" || "q9pJhA6Y1DazyvwfIZ3uz66Wz6E2") {
          admin = "True"
          blogEntry()
          return user.uid
        } else {
        return user.uid
        }
    }
    }

function userName(emailAddress,password) {
    let usersRef = database.ref("users")
    let userRef = usersRef.push({
      name: emailAddress,
      password: password
      })
  }

function saveArticle (title,articleURL) {
  let userID = getUID()
  let articlesRef = database.ref("articles")
  let articleRef = articlesRef.push({
    user: userID,
    url: articleURL,
    title: title
  })
}

function getSavedArticles() {
    let articlesLI = savedArticles.map((article) => {
      let articleString = `${article.title}`;
      let articleTitle = articleString.substring(1, articleString.length-1);
      if (article.user == getUID()) {
        return `<li><div class="card cardScroll savedNewsDisplay">
            <a id="savedArticleLink" href ='${article.url}'>${article.title}</a>
            <button id="deleteSavedArticleButton" onclick="deleteArticle('${article.key}')">Delete</button>
            </div>
            </li>`
      } else {
      }
    })
    articlesUL.innerHTML = articlesLI.join("")
}

function deleteArticle(articleKey) {
  database.ref("articles").child(articleKey).remove()
  getSavedArticles()
}



function submitComment (blog, title, comment) {
  let userID = getUID()
  let commentsRef = database.ref("comments")
  let commentRef = commentsRef.push({
    user: userID,
    blog: blog,
    title: title,
    comment: comment
  })
  let commentsLI = comments.map((comment) => {
    if (comment.blog == blog) {
      return `<li>
          ${comment.comment}
          </li>`
    } else {
    }
  })
  document.getElementById(blog).getElementsByClassName('comments')[0].innerHTML = commentsLI.join("")
  document.getElementById(title).value = ''
}

function getComments() {
database.ref("comments")
.on("value",function(snapshot){
      let comment = new Comment(snapshot.key,snapshot.val().user,snapshot.val().blog,snapshot.val().title,snapshot.val().comment)
      comments.push(comment)
});
setTimeout(function(){
  displayComments()
}, 3000);
}

function displayComments(blogKey) {
      let commentsLI = comments.map((comment) => {
        if (comment.blog == blogKey) {
          return `<li class="card alignSelf">
                ${comment.comment}
                </li>`
      } else {
      }
    })
    document.getElementById(blogKey).getElementsByClassName('comments')[0].innerHTML = commentsLI.join("")
  }

submitBtn.addEventListener("click",function(){
   zippers= zipInput.value
   loadData(zippers)
})

function loadData(zippers){
let localWeather= `https://api.openweathermap.org/data/2.5/weather?zip=${zippers}&units=imperial&apiKey=5c532f33d76a318783dd01c47721de8e`
fetch(localWeather)
.then(response=>response.json())
    .then(weatherItems=>{
      let sunsetHMS = new Date(weatherItems.sys.sunset*1000)
      let sunriseHMS = new Date(weatherItems.sys.sunrise*1000)
      let sunrise = sunriseHMS.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      let sunset = sunsetHMS.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      let windDirection = getDirection(weatherItems.wind.deg)
      let windspeed= weatherItems.wind.speed
      let windRound= Math.round(windspeed)
      let temperature =weatherItems.main.temp
      let tempeRound = Math.round(temperature)

if (windDirection == null){
  let weatherBug = `
<div class="row">
<image id= "icon" src= http://openweathermap.org/img/w/${weatherItems.weather[0].icon}.png>
 <p>${weatherItems.name} Weather: ${tempeRound} ° </p>
 <p class="hideContent">Wind  : ${windRound} Mph </p>
 <p class="hideContent">Sunrise: ${sunrise} </p>
 <p class="hideContent">Sunset: ${sunset} </p>
</div>`
weather.innerHTML=weatherBug

}
else {

let weatherBug = `
<div class="row">
<image id= "icon" src= http://openweathermap.org/img/w/${weatherItems.weather[0].icon}.png>
 <p>${weatherItems.name} Weather: ${tempeRound} °</p>
 <p class="hideContent">Wind  : ${windDirection} ${windRound} Mph </p>
 <p class="hideContent">Sunrise: ${sunrise} </p>
 <p class="hideContent">Sunset: ${sunset} </p>
</div>`
weather.innerHTML=weatherBug
}

let localNews= `https://gnews.io/api/v2/?q=${weatherItems.name}&token=114071df888d1c4880c2bff07c8ffc33`
fetch(localNews)
.then(response=>response.json())
.then(function(json){ return json
})
.then (function(newsItems){
let newsID = newsItems.articles.map(function(news){
  let articleTitle = JSON.stringify(news.title).replace(/&/, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "\\'")
    // if (news.image ==""){
        return `
        <div class="card cardScroll newsLink">
        <a id="saveLink" href = ${news.link}>${news.title}</a>
        <button id="articleSaveBtn" onclick="saveArticle('${articleTitle}','${news.link}')">Save</button>
        </div>
        `
})
news.innerHTML=newsID.join("")
})
})
}

function blogEntry () {
  if (admin == "True") {
    document.getElementById('blogEntry').style.display = "block";

    let blogEntryForm = `<h3>Blog Entry</h3><div id="table">
    <form method="post">
    <input type="text" id="titleEntry" placeholder="Title">
    <input type="file" id="imageEntry" value="upload">
    <progress value="0" max="100" id="uploader">0%</progress>
    <textarea cols="35" rows="5" id="contentEntry"></textarea>
    <button id="blogEntryBtn" type="button">Submit</button>
    </form></div>`

    document.getElementById('blogEntry').innerHTML = blogEntryForm
    



setTimeout(function() {
  imageEntry.addEventListener('change', function(e) {
    var file = e.target.files[0]
    var storageRef = firebase.storage().ref('images/' + file.name)
    var task = storageRef.put(file)
    task.on('state_changed',
      function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        uploader.value = percentage
      },
      function error(err) {
      },
      function complete() {
        var imageBucket = firebase.storage().ref('images/' + file.name);
        imageBucket.getDownloadURL().then(function(url){
          imageURL = url
        })
      }
    )
  })
},3000)

blogEntryBtn.addEventListener("click",function(){
let userID = getUID()
let titleEntry = document.getElementById('titleEntry').value
let contentEntry = document.getElementById('contentEntry').value
let blogsRef = database.ref("blogs")
let blogRef = blogsRef.push({
  user: userID,
  blogID: titleEntry,
  blogTitle: titleEntry,
  blogImg: imageURL,
  blogContent: contentEntry,
  


})
   document.getElementById('titleEntry').value=""
  
  document.getElementById('contentEntry').value=""
})
}}

function getBlogs() {
database.ref("blogs")
.on("value",function(snapshot){
      let blog = new Blog(snapshot.key,snapshot.val().user,snapshot.val().blogID,snapshot.val().blogTitle,snapshot.val().blogImg,snapshot.val().blogContent)
      blogs.push(blog)
});
setTimeout(function(){
  displayBlogs()
}, 3000);
}

function displayBlogs() {
      let blogsLI = blogs.map((blog) => {
        if (blog.blogTitle != null) {
          return `<div id='${blog.key}' class="card cardBlog">
          <div id="titleSpace">
          <div class="row alignSelf">
          <div class="col-md-4">
            <img class="blog round-image" src='${blog.blogImg}' />
          </div>
          <div class="col-md-8 px-3">
            <div class="card-block px-3">
              <h4 class="card-title title ">${blog.blogTitle}</h4>
            </div>
          </div>
          </div>
          <p class="card-text">${blog.blogContent}</p>
          </div>
          <div id="commentSpace">
          <input class="commentTextBox" id='${blog.blogTitle}' placeholder="Add comment here"></input>
          <div>
          <button class="btn btn-primary" type="button" id="displayComments" onclick=displayComments('${blog.key}')>Display Comments</button>
          <button class="btn btn-primary" onclick="submitComment('${blog.key}',document.getElementById('${blog.key}').getElementsByClassName('title')[0].innerHTML,document.getElementById('${blog.key}').getElementsByClassName('commentTextBox')[0].value)">Submit Comment</button>
          </div>
          <ul class="comments"></ul>
          </div>
          </div>`
        }
    })
    document.getElementById('blog').innerHTML = blogsLI.join("")
  }

function getDirection(angle) {
   let directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
   return directions[Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8];
}

getBlogs()

setTimeout(function(){
  adminCheck()
}, 3000);
