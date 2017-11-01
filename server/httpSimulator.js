var request = require('request');

var getTweet = function() {
request.get('http://localhost:3000/tweets/1/', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });
}
//getTweet();

var postTweet = function(message, id) {
    var options = {  
        url: 'http://localhost:3000/tweet/' + id,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({message: message})
    };
    
    request.post(options, function(error, response, body){
        console.log('error:', error);
        console.log('body', body);
    });
  
}

var generateTweets = function() {
    for (var i = 0; i < 10; i++) {
        //add code to call post tweet - we are going to simulate request 10 per second
    }
}

//postTweet('hey', 1);