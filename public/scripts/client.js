/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

const escape =  function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Renders all tweets onto homepage
const renderTweets = function(tweets) {
  for (let tweet of tweets) {
    const tweetAppended = createTweetElement(tweet);
    $('.tweet-feed').prepend(tweetAppended);
  }
};

// Timestamp of when the tweet was created
const timeStamp = function(date) {
  let timeElapsedinSeconds = (Date.now() - date) / 1000;
  let minutesPassed = Math.floor(timeElapsedinSeconds /  (60));
  let hoursPassed = Math.floor(minutesPassed /  (60));
  let daysPassed = Math.floor(hoursPassed /  (24));

  if (daysPassed > 1) {
    return daysPassed + " days ago";
  }
  if (hoursPassed > 1) {
    return hoursPassed + " hours ago";
  } else {
    return minutesPassed + " minutes ago";
  }
};

// New tweet html structure
const createTweetElement = function(tweet) {
  const $tweet = `
    <article class="tweet-container">
      <header class="tweet-head">
        <div class="avatar-name">
          <img class="avatar-img" src="${tweet.user.avatars}">
          <p>${tweet.user.name}</p> 
        </div>
        <p>${tweet.user.handle}</p>
      </header>
      <p class="punderline">${escape(tweet.content.text)}</p>
      <footer class="f-line">
        <p>${timeStamp(tweet.created_at)}</p> 
        <div>
          <span>&#10084</span>
          <span>&#8617</span>
          <span>&#9873</span>
      </div>
      </footer>
    </article>`;
  return $tweet;
};

$(document).ready(function() {
  $(".error-slide").hide();
  const loadTweets = function() {
    $.ajax({
      url: "/tweets",
      method: "GET"
    }).then(result => {
      renderTweets(result);
    }).catch(err => {
      console.log("ajax error caught");
    });
  };
  loadTweets();

  // Events after tweet submission
  $("form").on("submit", function(event) {
    event.preventDefault();

    // Shows error message if tweet is empty or contains too many characters
    let tweetContent = $("#tweet-text").val();
    if (!tweetContent) {
      $(".error-text h3").html("Cannot post an empty tweet!");
      $(".error-slide").slideDown();
      return;
    }
    if (tweetContent.length > 140) {
      $(".error-text h3").html("Too many characters in tweet!");
      $(".error-slide").slideDown();
      return;
    }

    // Loads new tweet onto the page after posting
    const serializeData = $(this).serialize();
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: serializeData
    })
      .then(() => {
        $.ajax({
          url: "/tweets",
          method: "GET"
        })
          .then((data) => {
            console.log("ajax data: ", data);
            $(".error-slide").slideUp();
            $("#counter").val(140);
            $("#tweet-text").val("");
            const $newTweet = createTweetElement(data[data.length - 1]);
            $(".tweet-feed").prepend($newTweet);
          })
          .catch(err => {
            console.log("ajax error caught");
          });
      });

  });

});