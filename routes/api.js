var express = require('express');
var router = express.Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
const user = require("../app/controller/userController.js");
const category = require("../app/controller/categoryController.js");
/* GET home page. */
router.get('/search', function(req, res, next) {
  console.log(req);
console.log(res);
  res.send({ title: 'Expresss' });
});

router.post('/register', function(req, res) {
    user.register(req, res)
});

router.post('/login', function(req, res) {
    user.login(req, res)
});

router.get('/user/getAll', function(req, res) {
    user.getAll(req, res);
});

router.post('/create-case', function(req, res) {
    user.createCase(req, res);
});

router.get('/categories',function(req, res){
  category.get(req,res);
});

router.post('/profile',multipartyMiddleware, function(req, res, next) {
    user.updateProfile(req,res);
});

router.post('/change-password', function(req, res) {
    user.changePassword(req, res);
});



module.exports = router;
