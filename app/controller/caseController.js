'use strict';
const caseModel = require('../caseModel.js');
const categoryModel = require('../categorymodel.js');
const donationModel = require('../donationModel.js');
var mongoose = require('mongoose');
var fs = require('fs');
//Method or calculate distance b/w two latitudes and longitudes in KM
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

//Method for display Time ago time stamps
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

//Method for list cases admin
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

//Method for edit cases for admin
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
//Method for delete cases for admin
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
//Method for list nearby cases using latitude and longitude via api call [/api/v1/loadcases]
module.exports.loadCases = function(req, res){
  var results = '';
  var limit = (typeof(req.query.limit) != 'undefined') ? req.query.limit : 8;
  var sort = {createdAt:'desc'};
  var findq = {status:1};
  if(req.query.sortDate) sort = {createdAt:req.query.sortDate};
  if(req.query.sortAmount) sort = {requiredAmount:req.query.sortAmount};
  if(req.query.category) findq.category = req.query.category;
  caseModel.find(findq).sort(sort).limit(limit).exec(function(err,cases){
      if(cases){
      cases.forEach(function(cases){
        if(getDistanceFromLatLonInKm(cases.latlng.lat,cases.latlng.lng,req.query.latlong.lat,req.query.latlong.lng) <= 100){
          results +=
            '<div class="col-md-3">'+
                '<div class="thumbnail case-card">'+
                    '<div style="background:url(/images/case/'+cases['_id']+') no-repeat;background-position:center center;background-size:cover;height:130px"></div>'+
                    '<div class="case-info">'+
                      '<a href="/case/'+cases['_id']+'">'+cases['title']+'</a>'+
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
      }
    if(results ==''){
      results = '<div class="col-md-12"><div class="alert alert-warning"><i class="fa fa-warning"></i> No results</div></div>'
    }
    res.send(results);
  });
};
//Method for render cases page for public users
module.exports.casePage = function(req,res){
  categoryModel.find({},function(err,data){
    res.render('category',{title:'Cases',category:data});
  });

}
//Method for render case description page for public users
module.exports.caseDetail = function(req,res,next){

  //Socket Implementation for updaing progress bar on every
  //new donation
  io.sockets.on('connection', function (socket) {
    socket.on('newDonation', function(data){
      var id =  mongoose.Types.ObjectId(data);
      var da = 0;
      donationModel.aggregate([
          {$match: {caseId:id}},
          {$group: {_id:'$userId',total:{$sum:'$donationAmount'}}}
        ],function(err,result){
          if(result){
            da = result[0].total;
          }

          socket.broadcast.emit('updateProgress',da);
          socket.emit('updateProgress',da);
      })

    });
  });
  caseModel.findById(req.params.ID).populate(['adminId','userId']).exec(function (err,caser) {
    var title = (caser) ? caser.title : '404 NOT FOUND'
    res.render('case',{title:title,case:caser,session:req.session.user,req:req});
  })

}

//Method for add new donation via api call [/api/v1/new-donation]
module.exports.newDonation = function(req,res,next){
  var id = mongoose.Types.ObjectId(req.body['case-id']);
  caseModel.findOne({_id:id,pin:req.body.pin},function(err,data) {
    if(data && data._id){
      var newDonation = new donationModel({
        caseId: req.body['case-id'],
        userId: req.session.user['_id'],
        donationAmount: req.body.amount
      });
      newDonation.save(function (err,data) {

        res.send({error:0});
      })
    }else{
      res.send({error:1});
    }
  })

}
//Method for SUM donation amount by grouping caseId & pass to caseDetail method in  this file
module.exports.getCaseDonation = function(req,res,next){
  var id =  mongoose.Types.ObjectId(req.params.ID);
  var da = 0;
  donationModel.aggregate([
      {$match: {caseId:id}},
      {$group: {_id:'$userId',total:{$sum:'$donationAmount'}}}
    ],function(err,result){
      if(result && result[0]){
        da = result[0].total;
        req.body.donationAmount = da;
      }else{
        req.body.donationAmount = 0;
      }
  })

  next();
}
