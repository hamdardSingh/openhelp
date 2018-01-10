/*********************************************
APIS FOR Admin
!!!URL prepends with /admin/
Example: /api/v1/login = /admin/api/v1/login
***********************************************/
var express = require('express');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var router = express.Router();
const admin = require("../app/controller/adminController.js");
const category = require("../app/controller/categoryController.js");
const user = require("../app/controller/userController.js");
const cases = require("../app/controller/caseController.js");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index', {layout:'admin/layout', title: 'openHelp Admin' });
});

router.post('/api/v1/login', function(req, res, next) {
	admin.login(req,res);
});

router.get('/api/v1/adminusers', function(req, res) {
    admin.usersList(req, res);
});

router.post('/api/v1/adminusers', multipartyMiddleware, function(req, res, next) {
	admin.edit(req,res);
});

router.delete('/api/v1/adminusers/:ID', function(req, res, next) {
	admin.delete(req,res);
});

router.get('/api/v1/categories', function(req, res) {
  category.get(req, res);
});

router.get('/api/v1/dummy',function(req,res) {
  admin.createDummy(req,res);
})

router.post('/api/v1/categories', function(req, res, next) {
	category.edit(req,res);
})

router.delete('/api/v1/categories/:ID', function(req, res, next) {
	category.delete(req,res);
});

router.get('/api/v1/users', function(req, res) {
  user.get(req, res);
});

router.post('/api/v1/users', multipartyMiddleware, function(req, res, next) {
	user.edit(req,res);
});

router.delete('/api/v1/users/:ID', function(req, res, next) {
	user.delete(req,res);
});

router.get('/api/v1/cases', function(req, res) {
  cases.get(req, res);
});

router.post('/api/v1/cases', multipartyMiddleware, function(req, res, next) {
	cases.edit(req,res);
});

router.delete('/api/v1/cases/:ID', function(req, res, next) {
	cases.delete(req,res);
});

module.exports = router;
