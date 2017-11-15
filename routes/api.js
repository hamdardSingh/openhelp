var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/search', function(req, res, next) {
  console.log(req);

  res.send({ title: 'Expresss' });
});


module.exports = router;
