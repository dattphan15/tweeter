/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/
// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];

const escape =  function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const renderTweets = function(tweets) {
  for (let tweet of tweets) {
    const tweetAppended = createTweetElement(tweet);
    $('.tweet-feed').prepend(tweetAppended);
  }
};

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


  $("form").on("submit", function(event) {
    event.preventDefault();
    // Counter value
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