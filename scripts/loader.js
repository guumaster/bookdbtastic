var mongoose = require('mongoose');
var args = require('yargs').argv;

var config = require('../src/config');
var util = require('../src/util/loader');

mongoose.connect(config.mongodb.uri);

util.loader({
  empty: (args.empty !== undefined),
  totalBooks: args.books || 10
}, function (err, res) {
    mongoose.connection.close();
    process.exit();
});
