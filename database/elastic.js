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
//     });