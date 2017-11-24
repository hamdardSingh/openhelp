'use strict';
const userModel = require('../usermodel.js');
module.exports.register = function(req, res){

    var newUser = new userModel({
      firstName: req.body.firstname
    });
    newUser.save(function (err) {
      if(err)
      console.log(err);
    });
    res.send(req.body);

};

module.exports.getAll = function(req,res){

  userModel.find({},function(err,users) {
    res.send(users);
  });
}
