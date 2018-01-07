'use strict';
const categoryModel = require('../categorymodel.js');

module.exports.get = function (req, res) {
  var result = [];
  categoryModel.find({},function(err,users) {
    if(users){
    	result = users
    }else{
    	result = {error:1,message:"No Category"};
    }
    res.send(result);
  });
};

module.exports.edit = function(req, res){
  var result = [];
	if(req.body._id){ // IF EXISTS UPDATE
		categoryModel.findById(req.body._id,function (err,category) {
			if(err){
				result = {error:1,msg:"Something went wrong :("};
			}else{
				category.name = req.body.name;

				category.save(function (err,save) {
					if(err){
						result = {error:1,msg:err};
					}else{
						result = {error:0,msg:"Category Updated"};

					}
					res.send(result);
				})
			}
		});
	}else{//If not exists create new admin user
		var newCategory = new categoryModel({
			name : req.body.name,
		});
		newCategory.save(function (err,save) {
			if(err){
				result = {error:1,msg:err};
			}else{
				result = {error:0,msg:"Category Created"};

			}
			res.send(result);
		});
	}
};

module.exports.delete = function(req, res){
  var id = req.params.ID;
  var result = [];
  categoryModel.remove({ '_id': id }, function (err) {
  if (err){
    result = {error:1,msg:err};
  }else {
    result = {error:0,msg:"Category Deleted"};
  }
  res.send(result);
  });
};
