
var Book = require('../book_model');

module.exports = function(app) {

  app.get('/new', addNew);
  app.get('/edit/:id', editBook);
  app.post('/update/:id', saveBook);
  app.get('/delete/:id', deleteBook);

};

function addNew(req, res, next) {
  res.render('book', {
    id: 0,
    title: "",
    author: "",
    description: "",
    action: "Add"
  });
}

function editBook(req, res, next) {
  Book.findById(req.params.id, function(err, book) {
    res.render('book', {
      id: book._id,
      title: book.title,
      author: book.author,
      description: book.description,
      content: book.content,
      action: "Update"
    });
  });
}

function saveBook(req, res) {
  if (req.params.id == 0) {
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      content: req.body.content
    });
    book.save(function(err) {
      res.redirect('/home');
    });
    return;
  }

  Book.findById(req.params.id, function(err, book) {
    book.title = req.body.title;
    book.author = req.body.author;
    book.description = req.body.description;
    book.content = req.body.content;
    book.save(function(err, book, count) {
      res.redirect('/home');
    });
  });

}

function deleteBook(req, res) {
  Book.findById(req.params.id, function(err, book) {
    book.remove(function(err, book) {
      res.redirect('/home');
    });
  });
}
