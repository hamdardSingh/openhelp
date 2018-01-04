var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'openhelp');
var Schema = mongoose.Schema;

var userLogin = new mongoose.Schema({
    name: 'string',
    email: 'string',
    mobileNo: 'number',
    password:'string',
    managingArea:'string',
    latlng:'object',
    radius:'number',
    root:'boolean'
})
var admin = db.model('admin',userLogin);

module.exports=admin;
