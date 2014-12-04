var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log('success');
  res.render('index', { title: 'yihubaiying' });
});

module.exports = router;
