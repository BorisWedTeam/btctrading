var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BTC' });
});

/* GET news page page. */
router.get('/news', function(req, res, next) {
    res.render('news', { title: 'BTC' });
});

/* GET tokens page page. */
router.get('/tokens', function(req, res, next) {
    res.render('tokens', { title: 'BTC' });
});

module.exports = router;
