'use strict';
var fs = require('fs');
const userModel = require('../usermodel.js');
const mailer_custom = require('../mailer/mail.js');
module.exports.register = function(req, res){

    if(req.body && req.body.length == 0){
        res.send({'error':1, 'message':'please fill out all fields'});

    }else if(req.body.username.length <= 3 || req.body.username.length >=30 ){

        res.send({'error':1, 'message':'Name should be between 3 and 30 letter'});

    }else if( req.body.password.length <= 6 || req.body.password.length >= 10 ){
        res.send({'error':1, 'message':'password length must be between 6 to 10 letter'});
    }else if(req.body.password != req.body['confirm-password']){
        res.send({'error':1, 'message':'new password and confirm password does not match'});
    }else {

        userModel.findOne({email: req.body.email}).then(function(result) {

                if (result && 1!=1) {
                    res.send({'error': 1, 'message': 'Email Id already exists'});
                } else {
                    var random =Math.floor(Math.random() * 999999999999999999);
                    var newUser = new userModel({
                        name: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        status: 0,
                        token:random

                    });
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            var msg = "Dear "+req.body.username+", \n Please click on link below to activate your account: \n http://localhost:3000/user/activate/"+random;
                            mailer_custom.mail(req.body.email,'Account Activation - openHelp',msg,res);
                            res.send({'error': 0, 'message': 'Account successfully created'});
                        }
                    });
                }
            });
    }



};

module.exports.login = function(req,res){
  userModel.findOne({'email':req.body.username,'password':req.body.password},function(err,users) {
    var result = {};
    if(users){
      result = {error:0, redir: 'ok'};
    }else{
      result = {error:1,message:'invalid username or password'};
    }
    res.send(result);
  });
}

module.exports.get = function(req,res){
  userModel.find({},function(err,users) {
    res.send(users);
  });
}

module.exports.edit = function(req, res){
  var result = [];
	if(req.body._id){ // IF EXISTS UPDATE
		userModel.findById(req.body._id,function (err,user) {
			if(err){
				result = {error:1,msg:"Something went wrong :("};
			}else{
        user.name= req.body.name;
        user.email= req.body.email;
        user.dateOfBirth= req.body.dateOfBirth;
        user.mobileNo= req.body.mobileNo;
        user.password= req.body.password;
        user.status= req.body.status;

				user.save(function (err,save) {
					if(err){
						result = {error:1,msg:err};
					}else{
            if(req.files.file){
							fs.readFile(req.files.file.path, function (err, data) {
								fs.writeFile('public/images/user/'+req.body['_id'], data, function (err) {

								});
							});
						}
						result = {error:0,msg:"User Updated"};

					}
					res.send(result);
				})
			}
		});
	}else{//If not exists create new admin user
		var newUser  = new userModel({
      name: req.body.name,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      mobileNo: req.body.mobileNo,
      password: req.body.password,
      status: req.body.status

		});
		newUser.save(function (err,save) {
			if(err){
				result = {error:1,msg:err};
			}else{

        if(req.files.file){
          fs.readFile(req.files.file.path, function (err, data) {
            fs.writeFile('public/images/user/'+save['_id'], data, function (err) {

            });
          });
        }
				result = {error:0,msg:"User Created"};
			}
			res.send(result);
		});
	}
};


module.exports.delete = function(req, res){
  var id = req.params.ID;
  var result = [];
  userModel.remove({ '_id': id }, function (err) {
  if (err){
    result = {error:1,msg:err};
  }else {
    result = {error:0,msg:"Category Deleted"};
  }
  res.send(result);
  });
};
