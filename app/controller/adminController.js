'use strict';
const adminModel = require('../adminmodel.js');


module.exports.login = function(req,res){
	var username = req.body.username;
	var pass = req.body.password;
	var result = {};
  adminModel.findOne({'email':username,'password':pass},function(err,users) {
    if(users){
    	req.session.user = users;
    	result = {error:0, user: users};
    	
    }else{
    	result = {error:1,user:req.session.user};
    }
    
    res.send(result);
  });
}
