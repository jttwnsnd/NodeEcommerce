/*global module:true*/
/*global require:true*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: String,
	tokenExpDate: Date
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);