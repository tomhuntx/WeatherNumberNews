var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const flickrRouter = require('./routes/flickr'); 
const weatherRouter = require('./routes/weather'); 
const numberRouter = require('./routes/number'); 

var app = express();


// Replace pug with html
var cons = require('consolidate');
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, '/public')));


/*
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}))

app.get('/numSearch', function(req, res){  
  var text = req.query.num; //mytext is the name of your input box 
  res.send('Your Text:' + text);  
});  
*/


// Statis to ensure html works
//app.use('/public',express.static(__dirname + '/public'));
app.use(express.static('public/stylesheets'));

app.use('/', indexRouter);

// Search queries
app.use('/search', flickrRouter);  
app.use('/weather', weatherRouter);
app.use('/number', numberRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

/* Off for debug purposes
// Error Handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/


module.exports = app;
