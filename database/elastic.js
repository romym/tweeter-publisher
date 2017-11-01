var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  httpAuth: 'elastic:changeme',
  log: 'trace'
});

client.ping({
    // ping usually has a 3000ms timeout 
    requestTimeout: 1000
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });
  
// var ElasticsearchCSV = require('elasticsearch-csv');

// var esCSV = new ElasticsearchCSV({
//     es: { index: 'users', type: 'basic', host: 'http://elastic:changeme@localhost:9200' },
//     csv: { filePath: '/Users/romymisra1/Desktop/test.csv', headers: true }
// });
 
// esCSV.import()
//     .then(function (response) {
//         console.log(response);
//     }, function (err) {
//         throw err;
// //     });
// activeTime varchar,
// impressionProb decimal,
// impressionProbInactive decimal,
// viewProb decimal,
// likeProb decimal,
// replyProb decimal,
// ret

// const app = Consumer.create({
//  queueUrl: 'https://sqs.us-east-1.amazonaws.com/575799175191/tweeter',
//  messageAttributeNames: ['tweetId','type'],
//  batchSize: 10,
//  handleMessage: (message, done) => {
//    // do some work with `message`
//    console.log('message', message);
//    console.log('message attribute', message.MessageAttributes.type.StringValue);
//    if (message.MessageAttributes.type.StringValue === ('like' || 'view' || 'impression' )) {
//       db.updateTweet(message.MessageAttributes.type.StringValue);
//    }
//      done();
//  }
// });

// app.on('error', (err) => {
//  console.log(err.message);
// });
//app.start();