var express = require('express');
var router = express.Router();
var Handlebars  = require('express-handlebars');
var user = require('../app/controller/userController');
var userAuth = require('../app/middleware/userAuth').userAuth;
/* GET users listing. */
router.all('/*', userAuth);
router.get('/', function(req, res, next) {
  res.render('user/Welcome', {title: 'Expresss' });
});

router.get('/my-account', user.profilePage);

router.get('/change-password', function(req, res, next) {
    res.render('user/Password_Change', {title: 'Expresss' });
});

router.get('/create-new-case', user.casePage);

router.get('/forgot-password', function(req, res, next) {
    res.render('user/forgot_password', {title: 'Expresss' });
});


module.exports = router;
