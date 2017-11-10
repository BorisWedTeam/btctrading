var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var passport =  require('passport');
var helper = require('sendgrid').mail;
var ObjectId = require('mongodb').ObjectID;

var config = require('../config/config');
var UserModel = require('../models/user');
var PriceModel = require('../models/price');



/* GET home page. */
router.get('/', function (req, res, next) {
    /*get btc chart data*/
    PriceModel.find({}).sort({'month': -1, 'day': -1, 'hour': -1, 'minute': -1}).limit(92).exec(function(err, prices) {
        var month = prices[0].month;
        var day = prices[0].day;
        var hour = prices[0].hour;
        var dataPoints = [];
        var tmpArray = [];

        for(var i = 0; i < prices.length; i++) {
            var tileObj = {};

            if((month == prices[i].month) && (day == prices[i].day) && (hour == prices[i].hour)) {
                tmpArray.push(parseFloat(prices[i].price));

                if(tmpArray.length == 4) {
                    tileObj['x'] = new Date(2017, prices[i].month, prices[i].day, prices[i].hour, 00).getTime();
                    tileObj['y'] = tmpArray;
                    dataPoints.push(tileObj);
                }
            } else {
                month = prices[i].month;
                day = prices[i].day;
                hour = prices[i].hour;

                tmpArray = [];
                tmpArray.push(parseFloat(prices[i].price));
            }
        }

        res.render('index', {title: 'BTC', dataPoints: dataPoints, message: req.flash('message')});
    });
});

/* GET news page page. */
router.get('/news', function (req, res, next) {
    res.render('news', {title: 'BTC'});
});

/* GET tokens page page. */
router.get('/tokens', function (req, res, next) {
    /*get btc chart data*/
    PriceModel.find({}).sort({'month': -1, 'day': -1, 'hour': -1, 'minute': -1}).limit(92).exec(function(err, prices) {
        var month = prices[0].month;
        var day = prices[0].day;
        var hour = prices[0].hour;
        var dataPoints = [];
        var tmpArray = [];

        for(var i = 0; i < prices.length; i++) {
            var tileObj = {};

            if((month == prices[i].month) && (day == prices[i].day) && (hour == prices[i].hour)) {
                tmpArray.push(parseFloat(prices[i].price));

                if(tmpArray.length == 4) {
                    tileObj['x'] = new Date(2017, prices[i].month, prices[i].day, prices[i].hour, 00).getTime();
                    tileObj['y'] = tmpArray;
                    dataPoints.push(tileObj);
                }
            } else {
                month = prices[i].month;
                day = prices[i].day;
                hour = prices[i].hour;

                tmpArray = [];
                tmpArray.push(parseFloat(prices[i].price));
            }
        }

        res.render('tokens', {title: 'BTC', dataPoints: dataPoints, message: req.flash('message')});
    });
});


/*login action*/
//Setting the local strategy route
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
}), function(req, res) {
    res.redirect('/');
});

/*GET forgot password page*/
router.get('/forgot-password', function (req, res, next) {
    res.render('forgot-password', {title: 'BTC', message: null});
});

/*POST forgot password action*/
router.post('/forgot-password', function(req, res, next) {
    UserModel.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            res.render('forgot-password', {title: 'BTC', message: 'Invalid Email Address'});
        }

        var from_email = new helper.Email('wow.webgenius@gmail.com');
        var to_email = new helper.Email('ggoldong@gmail.com');
        var subject = 'Forgot Password';
        var link = '<a href="' + config.site + "/authentication" + '?token=' + user._id +'" > Please click the link to set password </a>';
        var content = new helper.Content('text/html', link);
        var mail = new helper.Mail(from_email, subject, to_email, content);

        var sg = require('sendgrid')(config.sendgrid_api);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function(error, response) {
            console.log(response.statusCode)
            console.log(response.body)
            console.log(response.headers)
        })

        res.render('forgot-password', {title: 'BTC', message: 'Please check your email to reset your password'});
    });
})

router.get('/authentication', function (req, res, next) {
    var token = req.query.token;

    UserModel.findOne({
        _id: ObjectId(token)
    }, function(err, user) {
        if (err) {
            console.log('error=', err);
        }
        if (!user) {
            res.render('forgot-password', {title: 'BTC', message: 'Token mismatches!'});
        }
    });

    res.render('reset-password', {title: 'BTC', message: null, token: token});
});

router.post('/reset-password', function(req, res, next) {
    var passwd = req.body.password;
    var retypePasswd = req.body.confirm_password;
    var token = req.body.token;

    if(passwd != retypePasswd) {
        res.render('reset-password', {title: 'BTC', message: 'Password does not match!', token: token});
    } else {
        UserModel.findOne({
            _id: ObjectId(token)
        }, function(err, user) {
            if (err) {
                console.log('error=', err);
            }
            if (!user) {
                res.render('forgot-password', {title: 'BTC', message: 'Token mismatches!'});
            }

            user.password = passwd;
            user.save();

            res.redirect('/');
        });
    }
})

/*GET register page*/
router.get('/register', function (req, res, next) {
    res.render('register', {title: 'BTC', message: null});
});

/*POST new user*/
router.post('/register', function (req, res, next) {
    var passwd = req.body.password;
    var retypePasswd = req.body.confirm_password;

    if(passwd != retypePasswd) {
        res.render('register', {title: 'BTC', message: 'Password does not match!'});
    } else {
        var user = new UserModel(req.body);

        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                switch(err.code){
                    case 11000:
                    case 11001:
                        message = 'Username already exists';
                        break;
                    default:
                        message = 'Please fill all the required fields';
                }

                return res.render('register', {
                    title: 'BTC',
                    message: message,
                    user: user
                });
            }
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        });
    }
});

module.exports = router;
