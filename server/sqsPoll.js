const AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');
const db = require('../database/database.js');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const Consumer = require('sqs-consumer');

var receiveSqs = function() {
  var params = {
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
      "All"
  ],
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter"
};

  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else {
     
      // console.log('message', data.Messages[0]);
      // console.log('attribute body', data.Messages[0].Body);
      if (data.Messages) {
        var type = data.Messages[0].MessageAttributes.type.StringValue;
        var tweetId = data.Messages[0].MessageAttributes.tweetId.StringValue;
        if (type === 'impression') {
            db.updateTweet(type, tweetId);
        } else if (type === 'view' || type === 'like') {
            var userId = data.Messages[0].MessageAttributes.userId.StringValue;
            db.updateTweet(type, tweetId, userId);
        } else if (type === 'retweet') {
            var userId = data.Messages[0].MessageAttributes.userId.StringValue;
            db.updateTweet(type, tweetId, userId);
        } else if (type === 'reply') {
            var userId = data.Messages[0].MessageAttributes.userId.StringValue;
            var msg = data.Messages[0].Body;
            db.updateTweet(type, tweetId, userId, msg);
        } 
        console.log("Message Deleted", data.Messages[0].MessageAttributes);
        var deleteParams = {
            QueueUrl: "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter",
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function(err, data) {
            if (err) {
            console.log("Delete Error", err);
            } else {
            // console.log("Message Deleted", data.Messages[0].MessageAttributes);
            }
        });
    }
    }
  });
};

setInterval(receiveSqs, 500);