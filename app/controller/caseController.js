'use strict';
const caseModel = require('../caseModel.js');
var mongoose = require('mongoose');
var fs = require('fs');
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

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " Months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " Days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " Hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " Minutes";
  }
  return Math.floor(seconds) + " Seconds";
}
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

module.exports.loadCases = function(req, res){
  var results = '';
  var limit = (typeof(req.query.limit) != 'undefined') ? req.query.limit : 8;
  caseModel.find({status:1}).sort({createdAt:'desc'}).limit(limit).exec(function(err,cases){

      cases.forEach(function(cases){
        if(getDistanceFromLatLonInKm(cases.latlng.lat,cases.latlng.lng,req.query.latlong.lat,req.query.latlong.lng) <= 100){
          results +=
            '<div class="col-md-3">'+
                '<div class="thumbnail case-card">'+
                    '<div style="background:url(/images/case/'+cases['_id']+') no-repeat;background-position:center center;background-size:cover;height:130px"></div>'+
                    '<div class="case-info">'+
                      '<a href="/case/'+cases['_id']+'"><strong>'+cases['title']+'</strong></a>'+
                      '<p>'+cases['description']+'</p>'+
                      '<div class="row">'+
                        '<div class="col-sm-6 text-dimmed"><i class="fa fa-clock-o"></i> '+timeSince(cases.createdAt)+'</div>'+
                        '<div class="col-sm-6 text-right text-success text-amount">EUR '+cases.requiredAmount+'</div>'+
                      '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
          ;
        }
      });
    if(results ==''){
      results = '<div class="col-md-12"><div class="alert alert-warning"><i class="fa fa-warning"></i> No results</div></div>'
    }
    res.send(results);
  });
};
