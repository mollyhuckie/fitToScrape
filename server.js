var express = require("express");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");

var Article = require("./models/Article.js");

mongoose.Promise = Promise;


var app = express();

// app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});



app.get("/scrape", function(req, res) {

console.log("Hit /scrape");

  request("https://www.nytimes.com/section/us", function(error, response, html) {
   
    var $ = cheerio.load(html);
 
    $("article h2").each(function(i, element) {

      console.log($(this).text());

    });

    $("article p.summary").each(function(i, element) {

      console.log($(this).text());

    });

    $("article a.story-link").each(function(i, element) {

      console.log($(this).text());

    });

  });
  res.send("Scrape Complete");
});

app.get("/articles", function(req, res) {
  Article.find({}, function(error, doc) {
      res.json(doc);
  });
});

app.get("/articles/:id", function(req, res) {

  Article.findOne({ "_id": req.params.id })
  .populate("article")
  .exec(function(error, doc) {
      res.json(doc);
  });
});


app.post("/articles/:id", function(req, res) {

  var newArticle = new Article(req.body);

  newArticle.save(function(error, article) {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "article": article._id })
      .exec(function(err, article) {
          res.send(article);
      });
  });
});


app.listen(3000, function() {
  console.log("App running on port 3000!");
});