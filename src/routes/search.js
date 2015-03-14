var Book = require('../book_model');

module.exports = function(app) {
  app.get('/search', mongoSearch);
  app.get('/esearch', esSearch);
  app.get('/hesearch/', hydratedEsSearch);
};

function mongoSearch(req, res, next) {
  var terms = req.query.terms;
  if (!terms) {
    res.render('search');
    return;
  }
  Book.find({
    $or: [
      {title: new RegExp(terms, 'i')},
      {author: new RegExp(terms, 'i')},
      {description: new RegExp(terms, 'i')},
      {tags: new RegExp(terms, 'i')}
    ]
  }).limit(100).exec(function(err, books, count) {
    if (err) {
      return next(err);
    }
    res.render("search", {terms: terms, books: books, took: (Date.now() - req.start)})
  });
}

function esSearch(req, res, next) {
  var terms = req.query.terms;
  var from = req.query.page || 0;
  if (!terms) {
    res.render('esearch');
    return;
  }
  var esQuery = {query_string: {query: terms}};

  Book.search(esQuery, {from: from * 100, size: 100}, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render("esearch", {terms: terms, books: results.hits.hits, took: (Date.now() - req.start)})
  });
}

function hydratedEsSearch(req, res, next) {
  var terms = req.query.terms;
  var from = req.query.page || 0;
  if (!terms) {
    res.render('hesearch');
    return;
  }

  var esQuery = {query_string: {query: terms}};

  Book.search(esQuery, {from: from * 100, size: 100, hydrate: true}, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render("hesearch", {terms: terms, books: results.hits.hits, took: (Date.now() - req.start)})
  });
}
