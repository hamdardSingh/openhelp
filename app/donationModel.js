var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var donation = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    donationAmount: 'number',
    createdAt: { type: Date, default: Date.now }
})
var donationList = mongoose.model('donation',donation);

module.exports = donationList;
