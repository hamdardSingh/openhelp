var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'openhelp');
var Schema = mongoose.Schema;

var userLogin = new mongoose.Schema({
    name: 'string',
    email: 'string',
    dateOfBirth: 'string',
    mobileNo: 'number',
    group: 'number',
    password:'string'
})

var admin = db.model('admin',userLogin);

module.exports =admin;