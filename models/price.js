var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

/**
 * Price Schema
 */

var PriceSchema = new Schema({
    price: String,
    minute: Number,
    hour: Number,
    day: Number,
    month: Number
});

var price = mongoose.model('price', PriceSchema);

module.exports = price;