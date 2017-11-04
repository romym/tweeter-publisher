const AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');
const db = require('../database/database.js');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const Consumer = require('sqs-consumer');
var StatsD = require('node-statsd'),
client = new StatsD({
    host: 'statsd.hostedgraphite.com',
    port: 8125,
    prefix: '57d0d96b-1f64-41c4-8667-1a569b9e2f59'
});

client.socket.on('error', function(error) {
    return console.error("Error in socket: ", error);
  });

var receiveSqs = function() {
  var params = {
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
      "All"
  ],
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter"
};

  sqs.receiveMessage(params, async function(err, data) {
    var start = new Date();
    if (err) {
      console.log("Receive Error", err);
    } else {
     client.increment('.sqsMessageReceived');
     if (data.Messages) {
        var type = data.Messages[0].MessageAttributes.type.StringValue;
        var tweetId = data.Messages[0].MessageAttributes.tweetId.StringValue;
        if (type === 'impression') {
            await db.updateTweet(type, tweetId);
            var latency = new Date() - start;
            client.timing('.dbUpdateImpression', latency);
        } else if (type === 'view' || type === 'like') {
            var userId = data.Messages[0].MessageAttributes.userId.StringValue;
            await db.updateTweet(type, tweetId, userId);
            var latency = new Date() - start;
            client.timing('.dbUpdateView', latency);
        } else if (type === 'retweet') {
            var userId = data.Messages[0].MessageAttributes.userId.StringValue;
            await db.updateTweet(type, tweetId, userId);
            var latency = new Date() - start;
            client.timing('.dbUpdateRetweet', latency);
        } else if (type === 'reply') {
            var userId = data.Messages[0].MessageAttributes.userId.StringValue;
            var msg = data.Messages[0].Body;
            await db.updateTweet(type, tweetId, userId, msg);
            var latency = new Date() - start;
            client.timing('.dbUpdateReply', latency);
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