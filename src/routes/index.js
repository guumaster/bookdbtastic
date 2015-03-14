var async = require('async');
var elasticsearch = require('elasticsearch');

var Book = require('../book_model');
var config = require('../config');
var indexer = require('../util/indexer');
var loader = require('../util/loader');

var esClient = new elasticsearch.Client({
  host: config.elastic.host + ':' + config.elastic.port,
  log: 'trace'
});

module.exports = function(app) {
  app.get('/', waitForElasticsearch);
  app.get('/home', renderHome);
  app.get('/all', listAll);

  app.get('/dev/ping', esPing);
  app.get('/dev/createMapping', esCreateMapping);

  app.get('/dev/loader', bookLoader);
  app.get('/dev/indexer', bookIndexer);

};

function waitForElasticsearch(req, res, next) {

  // root url waits until Elasticsearch is available
  async.retry(10, checkElastic, function(err, results) {
    if (err) {
      return next(err);
    }

    Book.createMapping(function(err, mapping) {
      res.redirect('/home');
    });

  });
}

function checkElastic(callback) {

  esClient.ping({
    requestTimeout: 500,
    hello: "ping"
  }, function(error) {
    if (error) {
      setTimeout(function(){
        callback(new Error('Not ready'));
      }, 5000);
    } else {
      callback(null, 'ES available');
    }
  });
}

function renderHome(req, res) {
  res.render('index');
}

function listAll(req, res, next) {
  var page = req.query.page || 0;
  Book.find({})
    .skip(page * 100)
    .limit(100)
    .exec(function(err, allbooks, count) {
      res.render('all', {
        books: allbooks
      });
    });
}

function esCreateMapping(req, res, next) {
  Book.createMapping(function(err, mapping) {

    res.redirect('/home');

  });
}

function esPing(req, res, next) {

  esClient.ping({
    requestTimeout: 1000,
    ping: "pong!"
  }, function(error) {
    if (error) {
      res.send({
        status: 'elasticsearch is down'
      });
    }

    res.send({
      status: 'elasticsearch is ok'
    });
  });
}

function bookLoader(req, res, next) {

  loader.loader({
    empty: (req.query.empty !== undefined),
    totalBooks: req.query.books || 10
  }, function (err, result) {
    if (err) {
      return next(err);
    }

    res.send(result);
  });

}

function bookIndexer(req, res, next) {

  indexer.indexer({
    truncate: (req.query.truncate !== undefined)
  }, function(err, result){
    if (err) {
      return next(err);
    }

    res.send(result);

  });
}

