var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userLogin = new mongoose.Schema({
    name: 'string',
    email: 'string',
    dateOfBirth: 'string',
    mobileNo: 'number',
    password:'string',
    status: 'boolean',
    token: 'string'
})
var userDetails = mongoose.model('user',userLogin);

module.exports =userDetails;
