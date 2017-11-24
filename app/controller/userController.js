'use strict';
const userModel = require('../usermodel.js');
 app.exports.register = function(req, res){
    var user = {'user':'user'};
   var a = 4;
    var b = 5;
    user['sum'] = a+b;

    var newUser = new userModel({
        firstName: req.body.name
    });
    res.send(req.body);

};


//var mongoose = require('mongoose') , User = mongoose.model('User');
/*
app.post('/create', function(request, response){
    var user = new User();
    user.email = request.body.email;

    return user.Save().then(function(users) {
        // some code if save succeed
    }, function(err){
        // some code if save failed
    });
})};
*/

