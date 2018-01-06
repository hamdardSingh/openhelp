var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var category = new mongoose.Schema({
    name: 'string'
})

var category = mongoose.model('category',category);
module.exports = category;
