var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note. this is updated to an array to allow us to push multiple notes into the array.
  note: [
    {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
]
});

// This creates our model from the above schema, using mongoose's model method
// this says, for the mongoose database that we define in server.js, create an "article" collection and store the Article Schema as an entry (row of data)
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
