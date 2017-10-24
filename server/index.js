var express = require('express');
var faker = require('faker');

var app = express();

app.get('/tweets', function(req, res){
   // in this file we will get the tweets from the other server and then write into a postgres db
    res.send('Hello World');
})



// var arr = [];
// for (var i = 0 ; i < 100000; i++) {
//     var randomName = faker.name.findName()
//     arr.push(randomName);
// }
// var uniqueItems = Array.from(new Set(arr))
// console.log('uniquearray', uniqueItems.length);


app.listen(3000, function(){
    console.log('listening on port 3000');
})

// write some tests
// have anther server which will send fake tweets to this one 
// have a db file which create the schema and then write into postgres