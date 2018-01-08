var express = require('express');
var router = express.Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
const user = require("../app/controller/userController.js");
const category = require("../app/controller/categoryController.js");
const cases = require("../app/controller/caseController.js");
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


router.get('/categories',function(req, res){
  category.get(req,res);
});

router.get('/loadcases',cases.loadCases);

router.post('/profile',multipartyMiddleware, function(req, res, next) {
    user.updateProfile(req,res);
});

router.post('/change-password', function(req, res) {
    user.changePassword(req, res);
});

router.post('/create-case',multipartyMiddleware, user.createCase);

module.exports = router;
