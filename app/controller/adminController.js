'use strict';
const adminModel = require('../adminmodel.js');


module.exports.login = function(req,res){
	var username = req.body.username;
	var pass = req.body.password;
	var result = {};
  adminModel.findOne({'email':username,'password':pass},function(err,users) {
    if(users){
    	result = {error:0, user: users};
    }else{
    	result = {error:1};
    }
    
    res.send(result);
  });
}
