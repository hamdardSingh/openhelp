'use strict';
const caseModel = require('../caseModel.js');
var mongoose = require('mongoose');
var fs = require('fs');
module.exports.get = function (req, res) {
  var result = [];
  caseModel.find().populate([{path:'adminId'},{path:'userId'}]).exec(function(err,users) {
    if(err) console.log(err);
    if(users){
    	result = users
    }else{
    	result = {error:1,message:"No Case"};
    }
    res.send(result);
  });
};
module.exports.edit = function(req, res){
  var result = [];
  req.body.adminId = mongoose.Types.ObjectId(req.body.adminId._id);
  req.body.userId = mongoose.Types.ObjectId(req.body.userId._id);
  req.body.category = req.body.category.name;
	if(req.body._id){ // IF EXISTS UPDATE
		caseModel.findOneAndUpdate({_id : req.body._id},req.body,function (err,category) {
		    if(err){
          result = {error:1,msg:err};
        }else{
          result = {error:0,msg:"Case Updated"};
			  }
        if(req.files.file){
          fs.readFile(req.files.file.path, function (err, data) {
            fs.writeFile('public/images/case/'+req.body['_id'], data, function (err) {

            });
          });
        }
					res.send(result);
		});
	}else{//If not exists create new admin user
		var newCase = new caseModel(req.body);
		newCase.save(function (err,save) {
			if(err){
				result = {error:1,msg:err};
			}else{
				result = {error:0,msg:"Case Created"};

			}
      if(req.files.file){
        fs.readFile(req.files.file.path, function (err, data) {
          fs.writeFile('public/images/user/'+save['_id'], data, function (err) {

          });
        });
      }
			res.send(result);
		});
	}
};

module.exports.delete = function(req, res){
  var id = req.params.ID;
  var result = [];
  caseModel.remove({ '_id': id }, function (err) {
  if (err){
    result = {error:1,msg:err};
  }else {
    result = {error:0,msg:"Case Deleted"};
  }
  res.send(result);
  });
};
