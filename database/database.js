const { Pool, Client } = require('pg');
var pool = new Pool({
    database: 'tweeter',
    password: ''
  })
  
const client = new Client({
    database: 'tweeter',
    password: ''
  })
  client.connect();

pool.connect(function(err, client, done) {
    if (err) {
        console.log('could not connect');
    }
    console.log('connected to db');
    done()
  })

var insertUser = function(handle, name, timezone, publisher) {
    const text = 'INSERT INTO users (handle, name, timezone, publisher) VALUES($1, $2, $3, $4)'
    const values = [handle, name, timezone, publisher];
    
    client.query(text, values, (err, res) => {
        if (err) {
            console.log('error inserting into db', err);
        } 
    })
}

var insertTweet = function(user_id, message, created_at, views, likes, retweets, replies, impressions, type) {
    const text = 'INSERT INTO tweets (user_id, message, created_at, views, likes, retweets, replies, impressions, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
    const values = [user_id, message, created_at, views, likes, retweets, replies, impressions, type];
    
    client.query(text, values, (err, res) => {
        if (err) {
            console.log('error inserting into db', err);
        } else {
            console.log('inserted tweet');
            
        }
    })
}

var getTweets = function(user_id, callback) {
    //select * from tweets where user_id = 2 order by created_at desc limit 10;
    const text = 'SELECT * from tweets WHERE user_id = $1 order by created_at desc limit 25'
    const values = [user_id];
    
    client.query(text, values, (err, res) => {
        if (err) {
            console.log('error getting data', err);
            callback(err, null)
        } else {
            console.log('tweets', res);
            callback(null, res);
        }
    })
}


var insertFollow = function(follow_id, follower_id) {
    const text = 'INSERT INTO follows (follow_id, follower_id) VALUES($1, $2)'
    const values = [follow_id, follower_id];
    
    client.query(text, values, (err, res) => {
        if (err) {
            console.log('error inserting into db', err);
        } 
    })
}



module.exports.insertUser = insertUser;
module.exports.insertTweet = insertTweet;
module.exports.insertFollow = insertFollow;
module.exports.getTweets = getTweets;