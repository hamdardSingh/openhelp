var express = require('express');
var router = express.Router();
const admin = require("../app/controller/adminController.js");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index', {layout:'admin/layout', title: 'openHelp Admin' });
});

router.post('/api/v1/login', function(req, res, next) {
	admin.login(req,res);
	
});


module.exports = router;
