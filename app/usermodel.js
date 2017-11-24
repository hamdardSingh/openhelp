var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'openhelp');
var Schema = mongoose.Schema;

var userLogin = new mongoose.Schema({
    firstName: 'string',
    lastName: 'string',
    emailId: 'string',
    dateOfBirth: 'string',
    mobileNo: 'number',
    password:'string'
})

var userDetails = db.model('user',userLogin);

module.exports =userDetails;
