var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var schedule = require('node-schedule');
var request = require('request');
var flash=require("connect-flash");
var session = require('express-session');

var config = require('./config/config');
var index = require('./routes/index');
var users = require('./routes/users');

var PriceModel = require('./models/price');




var app = express();

//set session to the app
app.use(session(
    { cookie: { maxAge: 60000 },
    secret: 'sdkfhsdkhfslkdhfhdklvcbjvcblvjew',
    resave: false,
    saveUninitialized: false})
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//define default bootstrap path
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//passport config
require('./config/passport')(passport);

//connect to database
mongoose.connect(config.db);

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var options = {
    "method": 'GET',
    "url": 'https://api.coinmarketcap.com/v1/ticker/bitcoin/',
    "headers": {
        'Content-Type': 'application/json'
    }
};

//schedule tasks
var rule1 = new schedule.RecurrenceRule();
rule1.minute = 5;
var j = schedule.scheduleJob(rule1, function(){
    var date = new Date;
    var hour = date.getHours();
    var day = date.getDate();
    var month = date.getMonth();

    request(options, function(err, response, body) {
        var response = JSON.parse(body);
        var btcPrice = response[0].price_usd;
        var price = new PriceModel();
        price.price = btcPrice;
        price.minute = 5;
        price.hour = parseInt(hour) ;
        price.day = parseInt(day);
        price.month = parseInt(month);
        price.save();
    });
});

var rule2 = new schedule.RecurrenceRule();
rule2.minute = 20;
var k = schedule.scheduleJob(rule2, function(){
    var date = new Date;
    var hour = date.getHours();
    var day = date.getDate();
    var month = date.getMonth();

    request(options, function(err, response, body) {
        var response = JSON.parse(body);
        var btcPrice = response[0].price_usd;
        var price = new PriceModel();
        price.price = btcPrice;
        price.minute = 20;
        price.hour = parseInt(hour) ;
        price.day = parseInt(day);
        price.month = parseInt(month);
        price.save();
    });
});

var rule3 = new schedule.RecurrenceRule();
rule3.minute = 35;
var l = schedule.scheduleJob(rule3, function(){
    var date = new Date;
    var hour = date.getHours();
    var day = date.getDate();
    var month = date.getMonth();

    request(options, function(err, response, body) {
        var response = JSON.parse(body);
        var btcPrice = response[0].price_usd;
        var price = new PriceModel();
        price.price = btcPrice;
        price.minute = 35;
        price.hour = parseInt(hour) ;
        price.day = parseInt(day);
        price.month = parseInt(month);
        price.save();
    });
});

var rule4 = new schedule.RecurrenceRule();
rule4.minute = 50;
var m = schedule.scheduleJob(rule4, function(){
    var date = new Date;
    var hour = date.getHours();
    var day = date.getDate();
    var month = date.getMonth();

    request(options, function(err, response, body) {
        var response = JSON.parse(body);
        var btcPrice = response[0].price_usd;
        var price = new PriceModel();
        price.price = btcPrice;
        price.minute = 50;
        price.hour = parseInt(hour) ;
        price.day = parseInt(day);
        price.month = parseInt(month);
        price.save();
    });
});


module.exports = app;
