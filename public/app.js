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
        location.replace("/articles");
      });
  })
});

//* /////////////////////////////////////////////////////////////
//* When you click the "Write Note" button
//* /////////////////////////////////////////////////////////////

$(document).on("click", ".note", function() {

  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      // console.log(data);
      // console.log(data.link)
      // The title of the article
      $(thisId + "-notes").append("<h6 class='note-header'><span id='bold'>" + data.title + "</span> </h6>");

      let newForm = $("<form>")
      newForm.append("<label>Title</label>");
      newForm.append("<textarea class='form-control' id='note-title'></textarea>")
      newForm.append("<label>Note</label>");
      newForm.append("<textarea class='form-control' id='note-body'></textarea>")
      newForm.append("<button data-id='"+ data._id +"' id='savenote'>Save Note</button>");
    
      $(".notes").append(newForm);
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


//* /////////////////////////////////////////////////////////////
//* When you click the savenote button
//* /////////////////////////////////////////////////////////////

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
      $(".notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});



//* /////////////////////////////////////////////////////////////
//* Redirecting the user when the click on "Go to Article" button
//* /////////////////////////////////////////////////////////////

$(document).on("click", ".link-button", function() {
    console.log("clicked");
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data)
        location.replace(data.link);

  });

  });
