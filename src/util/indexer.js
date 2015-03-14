var async = require('async');
var _ = require('lodash');

var Book = require('./../book_model');

module.exports = {
  indexer: indexer
};

function indexer(options, callback) {

  async.series({
    mapping: function(next) {
      Book.createMapping(function(err, mapping) {
        if (err) {
          return next(err);
        }
        console.log('mapping created!');
        next();
      });

    },
    truncate: function(next) {
      if (!options.truncate) {
        return next();
      }

      Book.esTruncate(function(err) {
        if (err) {
          return next(err);
        }
        console.log('index truncated');
        next();
      });
    },
    index: function(next) {
      console.log('syncing');
      var stream = Book.synchronize();
      var count = 0;

      stream.on('data', function(err, doc) {
        count++;
      });

      stream.on('close', function() {
        console.log('close.indexed ' + count + ' documents!');
        next();

      });
      stream.on('error', function(err) {
        console.log(err);

        next(err);
      });

    }

  }, callback);

}
