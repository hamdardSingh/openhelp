'use strict';
const userModel = require('../usermodel.js');
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

                if (result) {
                    res.send({'error': 1, 'message': 'Email Id already exists'});
                } else {
                    var newUser = new userModel({
                        name: req.body.username,
                        email: req.body.email,
                        password: req.body.password

                    });
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
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

module.exports.getAll = function(req,res){
  userModel.find({},function(err,users) {
    res.send(users);
  });
}
