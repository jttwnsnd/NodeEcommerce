# Ecommerce Site Using Node, Express, MongoDB, and Angular. Full-Stack MEAN.

<img src="view_of_login.gif">

## Overview of Project
<p>DC Roasters is an Ecommerce site that is built on the MEAN stack. Login in with fake information for the full experience. Select a coffee plan that fits, or create your own.</p>

## Technologies, Frameworks, and Programming Languages userFound
<ul>
  <li>Jade for HTML, Sass for CSS, Javascript - I liked Jade and Sass's simplicity. I used CodeKit as my compiler throughout the project.</li>
  <li>AngularJS, AngularRoutes, AngularCookies - frontend logic to push/pull data</li>
  <li>Express.js & Node.js - my backend, which houses the custom API built for this project which gives us three objects to us: request(req), response (res), and next.</li>
  <li>Mongoose/MongoDB - Mongoose gives a bit of structure to this NoSQL database, which stores the data collected.</li>
  <li>Stripe - the payment feature in this at checkout that allows the use of credit cards.</li>
</ul>

## Challenges
<p>With this being one of my first full-stack projects, there was a lot to do and only so much time to do it. This really pushed me in ways of prioritizing and simplifying the problem.</p>
### Frontend
<p>Getting familiar with Jade in this project was an objective for me in this project. I was introduced to it with a couple Express.js projects like my <a href="http://www.github.com/jttwnsnd/socket-chatroom">socket chatroom</a> and loved the simplicity of it. Though, getting used to how it's syntax worked is more understanding how to say it in Jade that what to say for my markup.</p>
<p>With Angular having data-binding, this was an obvious choice for the front-end. Ensuring that Angular knew everything going on in the backend first meant that I have to send everything to my backend from Angular. Inside my views that is bound through ng-view, provided by Angular Routes for an single page app, I would use ng-model in my HTML and reference it in my JS through $scope in my mainController.js.</p>

```html
<input type="text" ng-model="username" placeholder="Enter Username" min-length="4" max-length="30" class="form-control"/>
```
```javascript
$scope.login = function(){
  $http.post(apiPath + '/login', {
    username: $scope.username,
    password: $scope.password,
  })
```
<p>With the $http.post, MongoDB is listening for this and ready to receive information, and binds the data from Angular to itself with the 'req' in the backend js callback.</p>

```javascript
var User = require('../models/user_model.js');

router.post('/login', function(req, res, next){
	User.findOne({
		username: req.body.username //this is the droid we are looking for
	}
```
<p> 'User' was a schema I built for Mongoose, a structure for my MongoDB. Here is the actual schema that 'User' utilizes:</p>

```javascript
var Schema = mongoose.Schema;

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
```




## back-end is an api driven by Express and mongoDB in node.
