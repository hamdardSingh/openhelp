var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'openhelp');
var Schema = mongoose.Schema;

var userLogin = new mongoose.Schema({
    name: 'string',
    email: 'string',
    dateOfBirth: 'string',
    mobileNo: 'number',
    password:'string'
})

var userDetails = db.model('user',userLogin);

module.exports =userDetails;
