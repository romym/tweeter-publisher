var express = require('express');
//var sim = require('./dataSimulator.js')
var db = require('../database/database.js');
var bodyParser = require('body-parser');
var sqs = require('./sqs.js');
var uuidv4 = require('uuid/v4');
var app = express();
app.use(bodyParser.json());


// accept a post request for a publisher to send a message
app.post('/tweet/:id', function(req, res){
    // what is the structure of req.body - can assume it's a message
    console.log('request body', req.body);
    var id = req.params.id;
    var date = new Date();  
    var tweet_uid = uuidv4();
    db.insertTweet(tweet_uid, id, req.body.message, date, 0, 0, 0, 0, 0, 'regular');
});

// accept a get request for a publisher to show their timeline - we show 25 of their tweets
app.get('/tweets/:id', function(req, res){
    var id = req.params.id;
    console.log('id ', id);
    db.getTweets(id, function(err, result){
        if (err) {
            console.log('error retrieving timeline');
            res.status(404).send('could not retrive timeline')
        } else {
            res.status(200).json(result);
        }
    })
});



app.listen(3000, function(){
    console.log('listening on port 3000');
})

