// // Grab the articles as a json
// $.getJSON("/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });

$(document).ready(function() {
  //Whenever someone clicks the scrape button
  $("#scrape").on("click", function(event) {
    // console.log("Clicked on scrape");
    // Empty the notes from the note section
    // Now make an ajax call for the Article
    event.preventDefault();
    $.get("/scrape")
      // With that done, add the note information to the page
      .then(function(data) {
        // console.log(data);
        console.log("helloworld2")
        // $.get("/articles")
        location.replace("/articles");
      });
  })
});

// Whenever someone clicks a p tag
$(document).on("click", ".note", function() {
  // Empty the notes from the note section
  // $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
// console.log("This is thisId" + thisId)
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h6 class='note-header'>" + data.title + "<br> Note </h6>");

      let newForm = $("<form>")
      newForm.append("<label>Title</label>");
      newForm.append("<textarea class='form-control' id='note-title'></textarea>")
      newForm.append("<label>Body</label>");
      newForm.append("<textarea class='form-control' id='note-body'></textarea>")
      newForm.append("<button data-id='"+ data._id +"' id='savenote'>Save Note</button>");
    
      $("#notes").append(newForm);
      // $("#notes").append("<hr>")

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function(event) {
  // Grab the id associated with the article from the submit button
  // event.preventDefault();

  var thisId = $(this).attr("data-id");
 
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#note-title").val(),
      // Value taken from note textarea
      body: $("#note-body").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
