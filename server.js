const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");


//* Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");
const PORT = process.env.PORT || 3000;
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
//! Comment out for deployment
// mongoose.connect(
//   "mongodb://localhost/NewsScraper",
//   { useNewUrlParser: true }
// );
//!

//! Uncomment for deployment
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://tyler:password1@ds153835.mlab.com:53835/heroku_228c7103";
mongoose.connect(MONGODB_URI);
//!

//* Routes

// app.get("/", function(req, res) {
//   res.render("index");
// });

//!TESTING
app.get("/", function (req, res) {
  db.Article.find({}).sort({ dateStamp: -1 }).limit(5).exec(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let allArticles = {
        articles: data
      }
      res.render("index", allArticles)
    }
  })
})
//!TESTING




// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.nytimes.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function (i, element) {
      // Save an empty result object
      const result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find("h2")
        .text();
      result.link =
        "http://www.nytimes.com/" +
        $(this)
          .find("a")
          .attr("href");
      result.summary = $(this)
        .find("p")
        .text();
      result.summary += $(this)
        .find("li")
        .text();
      // console.log(result.link);
      // Create a new Article using the `result` object built from scraping
      if (!result.summary) {
        result.summary = "No Summary Available";
      }

      db.Article.create(result)

        .then(function (dbArticle) {
          console.log("result" + result);
          console.log("dbArticle" + dbArticle);
          res.json(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // console.log("helloworld");
  // Grab every document in the Articles collection


  db.Article.find({}).populate("note")
    .then(function (dbArticle) {
      // console.log(dbArticle);
      // console.log(dbArticle[0].note)
      // If we were able to successfully find Articles, send them back to the client
      res.render("articles", { article: dbArticle });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        //push the value to the array (needed to push to the array), this allows for multiple notes to be included in the array
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
