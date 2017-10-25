var express = require('express');
var faker = require('faker');
var fs = require('fs');
var csv = require('fast-csv');
var app = express();

// create half a million user names 
var userGeneraton = function() {
    var users = [];
    var usersArr = [['name', 'username', 'timezone', 'publisher']]; // to store the data here as well for writing into the csv
    var tempNames = {};
    var publisherProb = 0.10;
    var handle, name, number, timezone, pubBool;
    while (users.length < 500000) {
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
            usersArr.push([handle, name, 'PST', pubBool]);
        }
        
    }

   //console.log('users', users);
   //console.log('users in array', usersArr);
//    fs.writeFile('userdata.txt', users, 'utf8', function(err, result){
//        if (err){
//            console.log('error writing into file', err);
//        } else {
//            console.log('wrote into the file');
//        }
//    })

   var ws = fs.createWriteStream('test.csv');
   csv.write(usersArr, {headers: true}).pipe(ws);
};

userGeneraton();


// create 10 million tweets 

app.listen(3000, function(){
    console.log('listening on port 3000');
})