var LocalStrategy = require('passport-local').Strategy,
    md5 = require('md5');

var UserModel = require('../models/user');
var UserInstance = new UserModel();

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        UserModel.findOne({
            _id: id
        }, '-salt -hashed_password', function(err, user) {
            done(err, user);
        });
    });

    //Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            UserModel.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('message','Invalid User'));
                }

                if (!(user.password === md5(password))) {
                    return done(null, false, req.flash('message','Invalid Password'));
                }

                return done(null, user);
            });
        }
    ));
}