/*global module:true*/
/*global require:true*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//user schema for mongoose to talk to mongoDB
var userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: String,
	tokenExpDate: Date,
	plan: String,
	frequency: String,
	amount: Number,
	weeklyTotal: String,
	grindType: Object,
	fullName: String,
	address: Object,
	order: Array
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);