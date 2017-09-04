$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


$(document).on("click", "p", function() {
    
      $("#article").empty();

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) {
      console.log(data);

      $("#article").append("<h2>" + data.header + "</h2>");

      $("#article").append("<input id='headerinput' name='header' >");
      
      $("#article").append("<textarea id='summaryinput' name='summary'></textarea>");
    

      if (data.article) {

        $("#headerinput").val(data.article.title);

        $("#summaryinput").val(data.article.body);
      }
    });
});

$(document).on("click", "#savearticle", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      header: $("#headerinput").val(),

      summary: $("#summaryinput").val()
    }
  })

    .done(function(data) {

      console.log(data);

      $("#article").empty();
    });

  $("#headerinput").val("");
  $("#summaryinput").val("");
});
