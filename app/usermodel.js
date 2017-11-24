var mongoose = require('mongoose');

schema = mongoose.schema;

var userLogin = new schema({
    firstName: string,
    lastName: string,
    emailId: string,
    dateOfBirth: string,
    mobiltNo: number
})

var userDetails = mongoose.modal('user',userLogin);

module.exports =userDetails;