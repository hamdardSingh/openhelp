var express = require('express');
var router = express.Router();
const user = require("../app/controller/userController.js");
const admin = require("../app/controller/adminController.js");
/* GET home page. */
router.get('/search', function(req, res, next) {
  console.log(req);
console.log(res);
  res.send({ title: 'Expresss' });
});

router.post('/register', function(req, res) {
    user.register(req, res)
});

router.get('/user/getAll', function(req, res) {
    user.getAll(req, res);
});

router.get('/admin/users', function(req, res) {
    admin.usersList(req, res);
});



module.exports = router;
