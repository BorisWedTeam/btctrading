var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    md5 = require('md5');

/**
 * User Schema
 */

var UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
});

UserSchema.pre('save', function(next) {
    var user = this;
    var hash = md5(user.password);
    user.password = hash;

    next();
});

var user = mongoose.model('user', UserSchema);

module.exports = user;
