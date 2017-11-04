var request = require('request');
var faker = require('faker');


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
        url: 'http://localhost:8888/tweet/' + id,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({message: message})
    };
    console.log(options);
    request.post(options, function(error, response, body){
        console.log("REACHED>>>>>>>>>>>>>>", response);
        if(error){
            console.log('error:', error);
        } 
        //console.log('body', body);
        //request.end();
    });
}

var generateTweets = function() {
    for (var i = 0; i < 10; i++) {
        postTweet('hey', 1);
    }
}

generateTweets();

// setInterval(generateTweets, 100);
// setInterval(getTweet, 100);

