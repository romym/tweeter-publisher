var express = require('express');
var app = express();
var AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// var params = {};

// sqs.listQueues(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.QueueUrls);
//   }
// });
// var params = {
//     DelaySeconds: 10,
//     MessageAttributes: {
//      "Title": {
//        DataType: "String",
//        StringValue: "The Whistler"
//       },
//      "Author": {
//        DataType: "String",
//        StringValue: "John Grisham"
//       },
//      "WeeksOn": {
//        DataType: "Number",
//        StringValue: "6"
//       }
//     },
//     MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
//     QueueUrl: "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter"
//    };
   
//    sqs.sendMessage(params, function(err, data) {
//      if (err) {
//        console.log("Error", err);
//      } else {
//        console.log("Success", data.MessageId);
//      }
//    });
var queueURL = "https://sqs.us-east-1.amazonaws.com/575799175191/tweeter";

var params = {
 AttributeNames: [
    "SentTimestamp"
 ],
 MaxNumberOfMessages: 3,
 MessageAttributeNames: [
    "All"
 ],
 QueueUrl: queueURL,
 VisibilityTimeout: 0,
 WaitTimeSeconds: 0
};

sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log("Receive Error", err);
  } else {
    // var deleteParams = {
    //   QueueUrl: queueURL,
    //   ReceiptHandle: data.Messages[0].ReceiptHandle
    // };
    console.log('data', data.Messages[0]);
    console.log('json parsed dtaa', JSON.parse(data.Messages[0].Body));
    // sqs.deleteMessage(deleteParams, function(err, data) {
    //   if (err) {
    //     console.log("Delete Error", err);
    //   } else {
    //     console.log("Message Deleted", data);
    //   }
    // });
  }
});
app.get('/', function(req, res){
    res.send('Hello World');
})

app.listen(3000, function(){
    console.log('listening on port 3000');
})