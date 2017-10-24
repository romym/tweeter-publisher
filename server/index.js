var express = require('express');
var app = express();

app.get('/tweets', function(req, res){
   // in this file we will get the tweets from the other server and then write into a postgres db
    res.send('Hello World');
})

app.listen(3000, function(){
    console.log('listening on port 3000');
})

// write some tests
// get this repo on github
// have anther server which will send fake tweets to this one 
// have a db file which create the schema and then write into postgres