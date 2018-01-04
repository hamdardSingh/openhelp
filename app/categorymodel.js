var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'openhelp');
var Schema = mongoose.Schema;

var category = new mongoose.Schema({
    name: 'string'
})

var category = db.model('category',category);
module.exports = category;
