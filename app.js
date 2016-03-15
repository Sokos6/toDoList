var express = require('express');
var bodyParser = require('body-parser');

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


module.exports = app;
