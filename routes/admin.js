var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index', {layout:'admin/layout', title: 'openHelp Admin' });
});

module.exports = router;
