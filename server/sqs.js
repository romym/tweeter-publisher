//get message bus connected
const AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');
const db = require('../database/database.js');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const Consumer = require('sqs-consumer');

var receiveSqs = function() {
  var params = {
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
      "All"
  ],
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter",
  VisibilityTimeout: 0,
  WaitTimeSeconds: 0
  };

  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else {
      var deleteParams = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter",
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      // console.log('message', data.Messages[0]);
      // console.log('attribute body', data.Messages[0].Body);
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
      sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
          console.log("Delete Error", err);
        } else {
          console.log("Message Deleted", data);
        }
      });
    }
  });
};

var sendSqs = function() {
  var params = {
      DelaySeconds: 0,
      MessageAttributes: {
          "tweetId": {
            DataType: "String",
            StringValue: "a5b8932a-734c-42e1-aad5-be815dd95c36"
          },
          "type": {
            DataType: "String",
            StringValue: "reply"
          },
          "userId": {
            DataType: "String",
            StringValue: "37907"
          }
        },
      MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter"
    };

  sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        receiveSqs();
        console.log("Success", data.MessageId);
      }
    });
  };

//sendSqs();