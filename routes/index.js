var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expresss' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Us' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.get('/images/admin/:ID', function(req, res, next) {
    var id = req.params.ID;
    var fs = require('fs');
    var path = require('path');
    var uri = path.resolve('public/images/admin/'+id);
    if (fs.existsSync(uri)) {
        res.sendFile(uri);
    }else{
      res.sendFile(path.resolve('public/images/thumb.png'));
    }
});

router.get('/images/user/:ID', function(req, res, next) {
    var id = req.params.ID;
    var fs = require('fs');
    var path = require('path');
    var uri = path.resolve('public/images/user/'+id);
    if (fs.existsSync(uri)) {
        res.sendFile(uri);
    }else{
      res.sendFile(path.resolve('public/images/thumb.png'));
    }
});



module.exports = router;
