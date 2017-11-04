// The goal of this file is to test the load I'm getting from the User microservice
// Data I will be getting are tweets with metrics on them and I will have to update the db accordingly

var sqs = require('./sqsSend.js');
var sample = require('./sampleTweet.js');
var arr = ['impression', 'view', 'like', 'retweet', 'reply'];
var userCount = 500000;
var paramGeneration = function() {
    var count = 0;
    var params = {
        DelaySeconds: 0,
        MessageAttributes: {
            "tweetId": {
              DataType: "String",
              StringValue: sample.arr[Math.floor(Math.random() * (sample.arr.length - 1))]
            },
            "type": {
              DataType: "String",
              StringValue: arr[Math.floor(Math.random() * (arr.length-1))]
            },
            "userId": {
              DataType: "String",
              StringValue: JSON.stringify(Math.floor(Math.random() * (userCount)))
            }
          },
        MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter"
    };
    console.log('params', JSON.stringify(params));
    return params;
}
//console.log('sample param', paramGeneration());
 var sqsLoadTest = function() {
     var count = 0;
     while (count < 10000){
         sqs.sendSqs(paramGeneration());
         count++;
     }
 }

 sqsLoadTest();
