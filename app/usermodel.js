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

app.exports =userDetails;

/*
var mongoose = require('mongoose') , Schema = mongoose.Schema, Q = require('q')
;

var UserSchema = mongoose.Schema({
    email: String,
})

UserSchema.methods.Save = function() {
    return Q.ninvoke(this, 'save');
}

var User = mongoose.model('User', UserSchema);
*/
