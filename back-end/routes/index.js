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
var randToken = require('rand-token').uid;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
	//checks if the username already exists...it shouldn't but who knows
	User.findOne({
		username: req.body.username
	}, function(error, document){
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
				var token = randToken(32);
				var tokenExpDate = Date.now();
				var userToAdd = new User({
					username: user_username,
					password: bcrypt.hashSync(user_password),
					email: user_email,
					token: token
					//Add tokenExpDate
				});
				userToAdd.save(function(error, documentAdded){
					if(error){
						res.json({
							message: 'errorAdding'
						});
					}else{
						res.json({
							message: 'User Added',
							username: user_username,
							token: token
						});
					}
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
			var token = randToken(32);
			var tokenExpDate = Date.now();
			if(loginResult){
				User.update({username:document.username}, {token: token, tokenExpDate: tokenExpDate}).exec();
				res.json({
					success: 'userFound',
					username: document.username,
					token: token,
					tokenExpDate: tokenExpDate
				});
			}else{
				res.json({
					failure: 'badPass'
				});
			}
		}
	});
});

router.get('/getUserData', function(req, res, next){
	var userToken = req.query.token; //the XXX in ?token=XXXXX
	if(userToken === undefined){
		//no token was supplied
		res.json({
			failure: 'noToken'
		});
	}else{
		User.findOne({
			token: userToken //this is the droid we're looking for
		}, function(error, document){
			if(document === null){
				res.json({failure: 'badToken'}); //Angular will need to act on this to get new token
			}else{
				res.json({
					username: document.username,
					grind: document.grind,
					frequency: document.frequency,
					token: document.token
				});
			}
		});
	}
	router.get('/options', function(req, res, next){
		res.json({
			message: 'success'
		});
	});
});

module.exports = router;
