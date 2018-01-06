var mongoose = require('mongoose');
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
var admin = mongoose.model('admin',userLogin);

module.exports=admin;
