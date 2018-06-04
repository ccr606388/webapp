var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bodyParser = require('body-parser')


var app = express();
var session = require('express-session')
var sess = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(session(sess))

app.use(function (req, res, next) {
  if (req.path.indexOf("private") == -1) {
    next()
  }
  else {
    if (req.session && req.session.pass == "passed") {
      next();
    } else {
      res.redirect("/admin/public/index.html")
    }
  }
})

app.use(express.static(path.join(__dirname, 'localfs')));


app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // 
  res.end("404")
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err)
  res.end('error');
});

module.exports = app;
