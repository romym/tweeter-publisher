var express = require('express');
var faker = require('faker');

var app = express();

// create half a million user names 
var userGeneraton = function() {
    var users = [];
    var tempNames = {};
    var publisherProb = 0.10;
    var handle, name, number, timezone, pubBool;
    while (users.length < 3) {
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
            var userObj = {
                handle: handle,
                name: name, 
                timezone: 'PST',
                publisher: pubBool
                }
            users.push(userObj);
        }
        
    }
   // console.log('users', users);
};




// create 10 million tweets 

app.listen(3000, function(){
    console.log('listening on port 3000');
})