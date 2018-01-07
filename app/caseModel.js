var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cases = new mongoose.Schema({
    title: 'string',
    adminId: { type: Schema.Types.ObjectId, ref: 'admin' },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    description: 'string',
    address: 'object',
    latlng: 'object',
    status: 'boolean',
    pin: 'number',
    videoId:'string',
    category:'string',
    requiredAmount:'number',
    createdAt: { type: Date, default: Date.now }
})
var caseDetails = mongoose.model('cases',cases);

module.exports = caseDetails;
