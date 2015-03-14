var mongoose = require("mongoose");
var yargs = require('yargs').argv;

var config = require('../src/config');
var util = require('../src/util/indexer');

mongoose.connect(config.mongodb.uri);

util.indexer({
  truncate: (yargs.truncate !== undefined)
}, function(err, res){
  console.log( err, res );
  mongoose.connection.close();
  console.log( 'DONE!');
  process.exit();
});
