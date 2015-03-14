var express = require('express');
var expressHbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./src/config');

mongoose.connect(config.mongodb.uri);

var app = express();

app.set('port', process.env.PORT || 3000);

app.engine('hbs', expressHbs({
  extname: 'hbs',
  defaultLayout: 'main.hbs'
}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));

app.use(function(req, res, next) {
  req.start = Date.now();
  next();
});

// Load all routes
require('./src/routes/index')(app);
require('./src/routes/crud')(app);
require('./src/routes/search')(app);

app.listen(app.get('port'), function() {
  console.log('app listening on port %s', app.get('port'));
});
