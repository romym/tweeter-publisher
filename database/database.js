const { Pool, Client } = require('pg');
const uuidv4 = require('uuid/v4');
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

var insertTweet = function(tweet_uid, user_id, message, created_at, views, likes, retweets, replies, impressions, type) {
    const text = 'INSERT INTO tweets (tweet_uid, user_id, message, created_at, views, likes, retweets, replies, impressions, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
    const values = [tweet_uid, user_id, message, created_at, views, likes, retweets, replies, impressions, type];
    
    client.query(text, values, (err, res) => {
        if (err) {
            console.log('error inserting into db', err);
        } else {
            console.log('inserted tweet');
            
        }
    })
}

var insertPostTweet = async function(tweet_uid, user_id, message, created_at, views, likes, retweets, replies, impressions, type) {
    const text = 'INSERT INTO tweets (tweet_uid, user_id, message, created_at, views, likes, retweets, replies, impressions, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
    const values = [tweet_uid, user_id, message, created_at, views, likes, retweets, replies, impressions, type];
    
    return await client.query(text, values);
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

var updateTweet = async function(param, tweet_uid, user_id, message) {
    if (param === 'impression') {
        var res = await pool.query('select * from tweets where tweet_uid = $1', [tweet_uid]);
        var impressions = 1 + res.rows[0].impressions;
        var update = await pool.query('update tweets set impressions = $1 where tweet_uid = $2', [impressions, tweet_uid]);
        console.log('updated impressions');
    }  else if (param === 'like') {
        var res = await pool.query('select * from tweets where tweet_uid = $1', [tweet_uid]);
        var likes = 1 + res.rows[0].likes;
        await client.query('update tweets set likes = $1 where tweet_uid = $2', [likes, tweet_uid]);
        return await client.query('insert into likes (user_like_id, tweet_like_id) values($1, $2)', [likes, user_id]);
        console.log('updated likes');
    } else if (param === 'view') {
        //console.log('reached here');
        var res = await pool.query('select * from tweets where tweet_uid = $1', [tweet_uid]);
        var views = 1 + res.rows[0].views;
        await client.query('update tweets set views = $1 where tweet_uid = $2', [views, tweet_uid]);
        return await client.query('insert into views (user_view_id, tweet_view_id) values($1, $2)', [views, user_id]);
        console.log('updated views');
    } else if (param === 'retweet') {
        var res = await pool.query('select * from tweets where tweet_uid = $1', [tweet_uid]);
        var retweets = 1 + res.rows[0].retweets;
        var parent_id = res.rows[0].id;
        var message = res.rows[0].message;
        var updateTweet = await pool.query('update tweets set retweets = $1 where tweet_uid = $2', [retweets, tweet_uid]);
        // insert a new tweet
        var newTweetId = uuidv4();
        var created_at = new Date();
        //var arr = [newTweetId, user_id, message, created_at, 0, 0, 0, 0, 0, 'regular'];
        var newTweet = await pool.query('INSERT INTO tweets (tweet_uid, user_id, message, created_at, views, likes, retweets, replies, impressions, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id', [newTweetId, user_id, message, created_at, 0, 0, 0, 0, 0, 'regular']);
        // insert a new row in the retweets table
        var tweet_id = newTweet.rows[0].id;
        return await pool.query('insert into retweets (tweet_id, parent_id) values($1, $2)', [tweet_id, parent_id]);
        console.log('updated retweets');
    } else if (param === 'reply') {
        console.log('reached here');
        // update the reply count
        var res = await pool.query('select * from tweets where tweet_uid = $1', [tweet_uid]);
        var replies = 1 + res.rows[0].replies;
        var parent_id = res.rows[0].id;
        var updateTweet = await pool.query('update tweets set replies = $1 where tweet_uid = $2', [replies, tweet_uid]);
        // insert a new tweet
        var newTweetId = uuidv4();
        var created_at = new Date();
        //var arr = [newTweetId, user_id, message, created_at, 0, 0, 0, 0, 0, 'regular'];
        var newTweet = await pool.query('INSERT INTO tweets (tweet_uid, user_id, message, created_at, views, likes, retweets, replies, impressions, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id', [newTweetId, user_id, message, created_at, 0, 0, 0, 0, 0, 'regular']);
        // insert a new row in the retweets table
        var tweet_id = newTweet.rows[0].id;
        return await pool.query('insert into replies (tweet_id, parent_id) values($1, $2)', [tweet_id, parent_id]);
        console.log('updated replies');
    }
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
module.exports.insertPostTweet = insertPostTweet;
module.exports.insertFollow = insertFollow;
module.exports.getTweets = getTweets;
module.exports.updateTweet = updateTweet;