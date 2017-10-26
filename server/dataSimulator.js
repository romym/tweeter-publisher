var faker = require('faker');
var fs = require('fs');
var csv = require('fast-csv');
var db = require('../database/database.js')

// create half a million user names 
var userGeneration = function() {
    var users = [];
    var usersArr = [];
    //var usersArr = [['id', 'name', 'username', 'timezone', 'publisher']]; // to store the data here as well for writing into the csv
    var tempNames = {};
    var publisherProb = 0.10;
    var handle, name, number, timezone, pubBool;
    var count = 1; 
    while (count < 500000) {
        // generate name 
        handle = faker.fake("{{name.firstName}} {{name.lastName}}").toLowerCase();
        // generate username
        name = handle.split(' ').join('');
        // check if it's unique
        if (!tempNames[handle]) {
            tempNames[handle] = name;
        // generate publisher value
            number = Math.random();
            if (number < publisherProb) {
                pubBool = true;
            }  else {
                pubBool = false;
            }
          // for the csv 
          // usersArr.push([count, handle, name, 'PST', pubBool]);
           db.insertUser(handle, name, 'PST', pubBool);
            count++;
            if (count%100 === 0) {
                console.log('100 added');
            }
        }
        
    }
    console.log('users generated');
//    var ws = fs.createWriteStream('user.csv');
//    csv.write(usersArr, {headers: false}).pipe(ws);
};

userGeneration(); 

// fs.createReadStream('test.csv').pipe(csv)
// .on('data', function(data){
//     console.log('writing data');
// })
// .on('end', function(data){
//     console.log('read finished');
// })


// create 10 million tweets 
var messageGeneration = function(){
    var tweets = [['id', 'user_id', 'message', 'date', 'views', 'likes', 'replies', 'retweets', 'impressions', 'type']];
    var tempMessages = {};
    var opening = ['just', '', '', '', '', 'ask me how i', 'completely', 'nearly', 'productively', 'efficiently', 'last night i', 'the president', 'that wizard', 'a ninja', 'a seedy old man', 'look', 'what is going on', 'let us', 'lady gaga', 'rihana', 'spence', 'SNL', 'night', 'seriously', 'i mean it','doing nothing'];
    var verbs = ['downloaded', 'interfaced', 'deployed', 'developed', 'built', 'invented', 'experienced', 'navigated', 'aided', 'enjoyed', 'engineered', 'installed', 'debugged', 'delegated', 'automated', 'formulated', 'systematized', 'overhauled', 'computed', 'created', 'implemented'];
    var objects = ['my', 'your', 'the', 'a', 'my', 'an entire', 'this', 'that', 'the', 'the big', 'a new form of', 'her', 'his'];
    var nouns = ['cat', 'koolaid', 'system', 'city', 'worm', 'cloud', 'potato', 'money', 'way of life', 'belief system', 'security system', 'bad decision', 'future', 'life', 'pony', 'mind', 'sandwich', 'buger', 'hair', 'dog', 'puppy', 'kitten', 'sun' , 'sf'];
    var tags = ['#techlife', '#burningman', '#sf', 'but only i know how', 'for real', '#sxsw', '#ballin', '#omg', '#yolo', '#magic', '', '', '', '', '#forreal','#tbh', '#nightout', '#movietime', '#partyallnight', '#serious'];
    var randomElement = function(array){
        var randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
      };
    var randomMessage = function(){
    return [randomElement(opening), randomElement(verbs), randomElement(objects), randomElement(nouns), randomElement(tags)].join(' ');
    };
    
    var randomDate = function(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    var message, count, user_id, date, type;
    var uniqueMsg = {};
    count = 1;
    while(tweets.length < 500000) {
        message = randomMessage();
        if(!uniqueMsg[message]) {
            uniqueMsg[message] = message;
            date = randomDate(new Date(2017, 08, 1), new Date());
            user_id = Math.floor(Math.random() * 500000);
            type = 'regular';
            // for csv: tweets.push([count, user_id, message, date, 0, 0, 0, 0, 0, type ])
            db.insertTweet(user_id, message, date, 0, 0, 0, 0, 0, type);
            count++;
        }
    }
    console.log(tweets.length);

    var ws = fs.createWriteStream('message.csv');
    csv.write(tweets, {headers: false}).pipe(ws);

}

//messageGeneration();

//generate follower data
var followGeneration = function() {
    var follow = [];
    var count = 1;
    //replace 100 with 500000
    var randomFollowers = function() {
        return Math.floor(Math.random() * (7)) + 2;  
      }
    var users = 100; //total number of users
    for (var i = 0; i < users; i++) {
        var followers = randomFollowers();
        for (j = 0; j < followers; j++){
            // for csv onlyfollow.push([count, i, Math.floor(Math.random() * users)]);
            db.insertFollow(i, Math.floor(Math.random() * users));  
            count++;
        }
    }
    console.log('follow table', follow);
}
//followGeneration();