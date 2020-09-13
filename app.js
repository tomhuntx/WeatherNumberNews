const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const weatherRouter = require('./routes/weather'); 
const numberRouter = require('./routes/number'); 
const newsRouter = require('./routes/news'); 

const app = express();


// Replace pug with html
const cons = require('consolidate');
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Use frameworks
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// Static to ensure html works
app.use(express.static(path.join(__dirname, '/public'))); 
//app.use(express.static('public'));

app.use('/', indexRouter);

// Search queries
app.use('/weather', weatherRouter);
app.use('/number', numberRouter);
app.use('/news', newsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


///* Comment to debug
// Error Handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//*/


module.exports = app;
