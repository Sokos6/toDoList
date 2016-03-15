var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var credentials = require('./credentials.js');



var app = express();

var mysql = require('mysql');
var conn = mysql.createConnection({
   host : 'localhost',
   user : 'user1',
   password : 'user',
   database : 'toDo'
});

var handlebars = require('express-handlebars')
    .create({defaultLayout: 'application'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');



conn.connect();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index.html');
});

app.get('/hello', function(req, res) {
    res.send('Hello world');
});

app.get("/signed", function(req,res){
    res.cookie('testCookie', {test : "test"}, {signed : true});
    res.render('index');
});

app.get('/allSignedCookies', function(req, res) {
  console.log("Cookies: ", req.signedCookies);
});

app.listen(3001, function() {
    console.log("listening on 3000");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(cookieParser(credentials.cookieSecret));


module.exports = app;
