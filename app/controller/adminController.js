'use strict';
const adminModel = require('../adminmodel.js');
var fs = require('fs');

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

module.exports.usersList = function(req,res){
	var result = [];
  adminModel.find({},function(err,users) {
    if(users){
    	result = users
    }else{
    	result = {error:1,message:"No Users"};
    }
    res.send(result);
  });
}

module.exports.edit = function (req,res) {
	var result = [];
	if(req.body._id){ // IF EXISTS UPDATE
		adminModel.findById(req.body._id,function (err,user) {
			if(err){
				result = {error:1,msg:"Something went wrong :("};
			}else{
				user.name = req.body.name;
				user.email = req.body.email;
				user.mobileNo = req.body.mobileNo;
				user.password = req.body.password;
				user.managingArea = req.body.managingArea;
				user.latlng = req.body.latlng;
				user.radius = req.body.radius;
				user.root = req.body.root;
				user.save(function (err,save) {
					if(err){
						result = {error:1,msg:err};
					}else{
						if(req.files.file){
							fs.readFile(req.files.file.path, function (err, data) {
								fs.writeFile('public/images/admin/'+req.body['_id'], data, function (err) {

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
		var newAdmin = new adminModel({
			name : req.body.name,
			email : req.body.email,
			mobileNo : req.body.mobileNo,
			password : req.body.password,
			managingArea : req.body.managingArea,
			latlng : req.body.latlng,
			radius : req.body.radius,
			root : req.body.root,

		});
		newAdmin.save(function (err,save) {
			
			if(err){
				result = {error:1,msg:err};
			}else{

				if(req.files.file){
					fs.readFile(req.files.file.path, function (err, data) {
						fs.writeFile('public/images/admin/'+save['_id'], data, function (err) {

						});
					});
				}
				result = {error:0,msg:"User Created"};

			}
			res.send(result);
		});
	}
}

module.exports.delete = function (req,res) {
	var id = req.params.ID;
	var result = [];
	adminModel.remove({ '_id': id }, function (err) {
  if (err){
		result = {error:1,msg:err};
	}else {
		result = {error:0,msg:"User Deleted"};
	}
	res.send(result);
	});
}
