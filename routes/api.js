var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/search', function(req, res, next) {
  console.log(req);
console.log(res);
  res.send({ title: 'Expresss' });
});

router.get('/register', function(req, res) {
    const user = require("../app/controller/userController.js");
    req.body = {firstname:'sandeep',email:'abc'};
    user.register(req, res);

});


module.exports = router;
