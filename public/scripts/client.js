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
]

$(document).ready(function () {
  console.log("client script loaded");
  console.log("data:", data);

  const renderTweets = function(tweets) {
    for (let tweet of tweets) {
      const tweetAppended = createTweetElement(tweet);
      $('.tweet-container').append(tweetAppended);
    }
  }

  const createTweetElement = function(tweet) {
    const $tweet = `
      <article class="tweet-container">
        <header>
          <div class="avatar-name">
            <img class="avatar-img" src="${tweet.user.avatars}">
            <p>${tweet.user.name}</p> 
          </div>
          <p>${tweet.user.handle}</p>
        </header>
        <p>${tweet.content.text}</p>
        <br>
        <footer>
          <p>${tweet.content.date}</p> 
          <div>
            <button>RETWEET</button>
            <button>SHARE</button>
            <button>LIKE</button>
        </div>
        </footer>
      </article>`

    return $tweet;
  }

  // renderTweets(data);  
  
  // const loadTweets = function() {
  //   const loadTweetData = renderTweets(data);
  //   $.ajax({
  //     url: "/tweets",
  //     method: "GET",
  //     data: loadTweetData
  //   }).then(result => {
  //     console.log("load tweet result: ", result);
  //   }).catch(err => {
  //     console.log("ajax error caught");
  //     console.log(err); // error
  //   });
  // }
  // loadTweets();


  $("form").on("submit", function(event) {
    event.preventDefault();

    // Counter value
    let tweetContent = document.getElementById("counter");
    console.log("tweetContent: ", $(tweetContent).val());
    console.log("#tweet-text: ", $("#tweet-text").val());
    
    if (!$("#tweet-text").val()) {
      alert("Cannot post an empty tweet!");
    };

    const serializeData = $(this).serialize();
    console.log("serializeData: ", serializeData);
    

    $.ajax({
      url: "/tweets",
      method: "POST",
      data: serializeData
    }).then(result => {
      console.log("result: ", result);
    }).catch(err => {
      console.log("ajax error caught");
      console.log(err); // error
    });
  });


})