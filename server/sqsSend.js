//get message bus connected
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


var sendSqs = function(params) {
  sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        client.increment('.sqsMessageSent')
        console.log("Success", data.MessageId);
      }
    });
  };

module.exports.sendSqs = sendSqs;
 
//sendSqs();