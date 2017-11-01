//get message bus connected
const AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');
const db = require('../database/database.js');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const Consumer = require('sqs-consumer');

const app = Consumer.create({
 queueUrl: 'https://sqs.us-east-1.amazonaws.com/575799175191/tweeter',
 messageAttributeNames: ['tweetId','type'],
 batchSize: 10,
 handleMessage: (message, done) => {
   // do some work with `message`
   console.log('message', message);
   console.log('message attribute', message.MessageAttributes.type.StringValue);
   if (message.MessageAttributes.type.StringValue === ('like' || 'view' || 'impression' )) {
      db.updateTweet(message.MessageAttributes.type.StringValue);
   }
   // check the attricute and update db accordingly
   //update like
   //update impressions
   //update views
   //update retweets
   //update reply

   done();
 }
});

app.on('error', (err) => {
 console.log(err.message);
});

db.updateTweet('impression', 'a5b8932a-734c-42e1-aad5-be815dd95c36');
//app.start();

var params = {
    DelaySeconds: 10,
    MessageAttributes: {
        "tweetId": {
          DataType: "String",
          StringValue: "1"
        },
        "type": {
          DataType: "String",
          StringValue: "like"
        }
      },
    MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter"
   };

// sqs.sendMessage(params, function(err, data) {
//     if (err) {
//       console.log("Error", err);
//     } else {
//       console.log("Success", data.MessageId);
//     }
//   });


// get elastic search connected with your log data
// get kibana to visualize your log data