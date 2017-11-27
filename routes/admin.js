var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index', {layout:'admin/layout', title: 'openHelp Admin' });
});

router.post('/api/v1/login', function(req, res, next) {
  res.send({'error':1});
});


module.exports = router;
