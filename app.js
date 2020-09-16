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

// Host the port and server
// Moved from bin/www as docker was having issues
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`TFN Listening on port ${port}`)
})


/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'TFN Mashup' });
});

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


/**
 * Get port from environment and store in Express.
 */
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

///* Comment to debug errors
// Error Handler
app.use(function(err, req, res, next) {
  // Render the error.html page
  res.status(err.status || 500);
  res.render('error');
});
//*/

module.exports = app;
