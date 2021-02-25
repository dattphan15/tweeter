$(document).ready(function() {
  console.log("We're connected!");

  $("#tweet-text").on("input", function() {
    console.log($(this).siblings("div").find("output"));
    let length = $(this).val().length;
    let counter = $(this).siblings("div").find("output");
    counter.html(140-length);
    if (140 - length < 0) {
      counter.addClass("turnRed");
    }
    else {
      counter.removeClass("turnRed");
    }
  });

  $("textarea").on("click", function() {
    console.log(this);
  });

});

