'use strict';
var fs = require('fs');
const userModel = require('../usermodel.js');
const category = require('../categorymodel.js');
const caseModel = require('../caseModel.js');
const admin = require('../adminmodel.js');
const mailer_custom = require('../mailer/mail.js');
var mongoose = require('mongoose');
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

module.exports.register = function(req, res){

    if(req.body && req.body.length == 0){
        res.send({'error':1, 'message':'please fill out all fields'});

    }else if(req.body.username.length <= 3 || req.body.username.length >=30 ){

        res.send({'error':1, 'message':'Name should be between 3 and 30 letter'});

    }else if( req.body.password.length <= 6 || req.body.password.length >= 20 ){
        res.send({'error':1, 'message':'password length must be between 6 to 20 letter'});
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
      req.session.user = users;
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

module.exports.profilePage = function(req,res){
  var id = req.session.user['_id'];
  userModel.findById(id,function(err,user){
    res.render('user/My_Account', {title: 'My Profile',user:user });
  });
};

module.exports.casePage = function(req,res){

  var id = req.session.user['_id'];
  userModel.findById(id,function(err,user){
    category.find({},function (err,category) {

      res.render('user/New_Case', {title: 'Create New case',user:user ,category:category});
    })

  });
};

module.exports.updateProfile = function(req,res){
  var id = req.session.user['_id'];
  userModel.findOneAndUpdate({_id : id},req.body,function(err,user){
    if(err) res.send({error:1,msg:err});
    if(req.files.file){
      fs.readFile(req.files.file.path, function (err, data) {
        if(err) console.log(err);
        fs.writeFile('public/images/user/'+id, data, function (err) {
        });
      });
    }
    res.send({error:0,msg:"Profile Updated"});
  });
};


module.exports.changePassword = function(req,res){
  var id = req.session.user['_id'];
  if( req.body.npass.length <= 6 || req.body.npass.length >= 20 ){
      res.send({'error':1, 'msg':'password length must be between 6 to 20 letter'});
  }else if(req.body.npass != req.body.rpass){
    res.send({'error':1, 'msg':'New password doesn\'t match'});
  }else{
    userModel.findById(id,function(err,user){
      if(req.body.cpass != user.password){
        res.send({'error':1, 'msg':'Invalid current password'});
      }else{
        user.password = req.body.npass;
        user.save(function (err,user) {
          res.send({error:0,msg:"Password changed successfully"})
        })
      }
    });
  }

};

module.exports.createCase = function(req,res){

  var result = {error:1};
  admin.find({},function(err,admins){

    admins.forEach(function(admin){
      if(getDistanceFromLatLonInKm(admin.latlng.lat,admin.latlng.lng,req.body.latlng.lat,req.body.latlng.lng) <= admin.radius){
        result = admin;
      }
    });

    if(!result.error){
      var pin = Math.floor(1000 + Math.random() * 9000);
      var newCase = new caseModel({
        'title': req.body.title,
        'description': req.body.description,
        'address': req.body.address,
        'latlng': req.body.latlng,
        'requiredAmount': req.body.requiredAmount,
        'category': req.body.category,
        'pin':pin,
        'userId':mongoose.Types.ObjectId(req.session.user['_id']),
        'adminId':mongoose.Types.ObjectId(result['_id'])
      });
      newCase.save(function (err,save) {
        if(req.files.file){
          fs.readFile(req.files.file.path, function (err, data) {
            fs.writeFile('public/images/case/'+save['_id'], data, function (err) {

            });
          });
        }
        res.send({name:result.name,email:result.email,pin:save.pin});
      })
    }

  });
}
