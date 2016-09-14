/*global module:true*/
/*global require:true*/
var express = require('express');
var router = express.Router();
//include mongoose module
var mongoose = require('mongoose');
//the url mongo connects to, and the port mongo is listening to
var mongoUrl = 'mongodb://localhost:27017/ecommerce';
//set up user model. it is a mongoose model, and automatically
//uses db that mongoose connects to
var User = require('../models/user_model.js');
//connect mongoose using mongoUrl
mongoose.connect(mongoUrl);

var bcrypt = require('bcrypt-nodejs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
	//checks if the username already exists...it shouldn't but who knows
	User.findOne({
		username: req.body.username
	}, function(error, document){
		console.log(document);
		//document is return from mongo query
		//the ocument wil have a property for each field. need to check the password
		if(document === req.body.username){
			if(req.body.password !== req.body.password2){
				res.json({
					message: 'no match',
					taken: 'inUse'
				});
			}else{
				res.json({
					taken: 'inUse'
				});
			}
		}else{
			if(req.body.password !== req.body.password2){
			res.json({
				message: 'no match'
			});
			}else{
				var user_username = req.body.username;
				var user_password = req.body.password;
				var user_email = req.body.email;

				var userToAdd = new User({
					username: user_username,
					password: bcrypt.hashSync(user_password),
					email: user_email
				});

				userToAdd.save();
				res.json({
					message: 'User Added',
					username: user_username,
					full_info: userToAdd
				});
			}
		}
	});
});

router.post('/login', function(req, res, next){
	User.findOne({
		username: req.body.username //this is the droid we are looking for
	}, function(error, document){
		//document is return from mongo query
		//the ocument wil have a property for each field. need to check the password
		if(document === null){
			res.json({
				// passwords do not match
				failure: 'noUser'
			});
		}else{
			var loginResult = bcrypt.compareSync(req.body.password, document.password);
			if(loginResult){
				res.json({
					success: 'userFound',
					username: document.username
				});
			}else{
				res.json({
					failure: 'badPass'
				});
			}
		}
	});
});

module.exports = router;
