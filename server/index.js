var express = require('express');
//var sim = require('./dataSimulator.js')
var db = require('../database/database.js');
var bodyParser = require('body-parser');
var sqs = require('./sqsSend.js');
var uuidv4 = require('uuid/v4');
var app = express();
app.use(bodyParser.json());
// var redis = require("redis"),
// redisClient = redis.createClient();
var StatsD = require('node-statsd'),
client = new StatsD({
    host: 'statsd.hostedgraphite.com',
    port: 8125,
    prefix: '57d0d96b-1f64-41c4-8667-1a569b9e2f59'
});

client.socket.on('error', function(error) {
    return console.error("Error in socket: ", error);
  });

// redisClient.on('connect', function() {
//     console.log('connected');
// });

// how many requests am I getting per second


// accept a post request for a publisher to send a message
app.post('/tweet/:id', function(req, res){
    // what is the structure of req.body - can assume it's a message
    var start = new Date();
    client.increment('.postPublisherTweet');
    console.log('request body', req.body);
    var id = req.params.id;
    var date = new Date();  
    var tweet_uid = uuidv4();
    //console.time('testForEach');
    db.insertPostTweet(tweet_uid, id, req.body.message, date, 0, 0, 0, 0, 0, 'regular');
    // send data to user console
    // send data to redis
    //console.timeEnd('testForEach');
    
    // var latency = new Date() - start;
    // client.timing('.postTweetDb', latency);
    res.sendStatus(201);
});

// accept a get request for a publisher to show their timeline - we show 25 of their tweets
app.get('http://localhost:3000/tweets/:id', function(req, res){
    var start = new Date();
    var id = req.params.id;
    console.log('id ', id);
    client.increment('.getPublisherTweet');
    redisClient.get(id, function(err, reply) {
        // reply is null when the key is missing 
        console.log(reply);
    });
    db.getTweets(id, function(err, result){
        if (err) {
            console.log('error retrieving timeline');
            res.status(404).send('could not retrive timeline')
        } else {
            var latency = new Date() - start;
            client.timing('.getPublisherTweetDb', latency);
            res.status(200).json(result);
        }
    })
});

// how many db requests per second - set a counter: increment, decrement, count
// how many times something happens per second
//client.count('string', number);
// guages - measure something's value at a particular time
//

// redisClient.set(5, "romy", redis.print);
// redisClient.get(5, function(err, reply) {
//     // reply is null when the key is missing 
//     console.log(reply);
// });

app.listen(8888, function(){
    console.log('listening on port 3000');
})

