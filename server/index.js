var express = require('express');
var sim = require('./dataSimulator.js')

var app = express();

app.get('/tweets', function(req, res){
    res.send('Hello World');
})



app.listen(3000, function(){
    console.log('listening on port 3000');
})

