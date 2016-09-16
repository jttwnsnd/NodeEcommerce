/*global angular:true */
/*global console:true */
var eComApp = angular.module('ecommerceApp', ['ngRoute', 'ngCookies']);
var eController = eComApp.controller('mainController', function($scope, $rootScope, $http, $location, $cookies){
	$scope.test = 'yo';
	$scope.userExists = false;
	var apiPath = 'http://localhost:3000';
	checkToken();

	//arrays for my order forms to reference
	$scope.frequencies = [
		'Weekly',
		'Bi-weekly',
		'Monthly'
	];

	$scope.grinds = [
		{option: 'Extra coarse'},
		{option: 'Coarse'},
		{option: 'Medium-coarse'},
		{option: 'Medium'},
		{option: 'Medium-fine'},
		{option: 'Fine'},
		{option: 'Extra fine'}
	];

	//when register is clicked.
	$scope.register = function() {
		console.log($scope.username);
		$http.post(apiPath + '/register', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response) {
			if((response.data.taken === 'inUse') && (response.data.message === 'no match')){
				$scope.errorMessage = true;
			}else if((response.data.taken === 'inUse') || (response.data.message === 'no match')){
				$scope.errorMessage = true;
			}else{
				$scope.errorMessage = false;
			}
			if(response.data.taken === 'inUse'){
				$scope.userExists = true;
			}else{
				$scope.userExists = false;
			}
			if(response.data.message === 'no match'){
				$scope.noMatch = true;
				console.log('passwords dont match');
			}else{
				$scope.noMatch = false;
			}
			if(response.data.message === 'User Added'){
				$rootScope.username = response.data.username;
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
				$rootScope.loggedOut = true;
				$location.path('/options');
				console.log(response.data);
			}
		}, function errorCallback(response) {
			console.log(response.data);
		});
	};
	//whe login is invoked
	$scope.login = function(){
		$http.post(apiPath + '/login', {
			username: $scope.username,
			password: $scope.password,
		}).then(function successCallback(response) {
			if(response.data.failure === 'badPass'){
				$scope.errorMessage = true;
				$scope.noMatch = true;
				console.log('bad password');
			}else{
				$scope.errorMessage = false;
				$scope.noMatch = false;
			}
			if(response.data.success === 'userFound'){
				$rootScope.username = response.data.username;
				$rootScope.loggedOut = true;
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
				$location.path('/options');
				console.log(response.data);
			}
			if(response.data.failure === 'noUser'){
				console.log('Incorrect password');
			}
		}, function errorCallback(response) {
			console.log(response);
		});
	};
	
	$scope.$watch(function(){
		return $location.path();
	}, function(newPath){
		if(newPath === '/payment'){
			console.log('hello');
		}
	});
	//$scope.addToCart = function(idOfThingClickedOn){
		//var oldCart = $cookies.get('cart');
		//var newCart = oldCart + ',' + idOfThingClickedOn;
		//cookies.put('cart', newCart)
	//}
	//$scope.gtCart = function(){
		//var cart = $cookies.get('cart');
		//var cartItemsArray = cart.split(',');
		//for(var i = 0; i < cartItemsArray.length; i++){
			// do stuff with each index
			// ie get the cost, name, etc and load them up in another array
		//}
	//}
	$scope.logout = function(){
		$rootScope.loggedOut = true;
		$cookies.put('token', '');
		$cookies.remove('token');
		$cookies.remove('username');
		console.log();
	};
	
	//select your options and submit them to Mongo
	$scope.optionsForm = function(form){
		var weeklyTotal, grindType;
		if(form === 1){
			weeklyTotal = '$7.00';
			grindType = $scope.grindTypeSolo;
		}else if(form === 2){
			weeklyTotal = '$18.00';
			grindType = $scope.grindTypeFamily;
		}else{
			weeklyTotal = String(20 * $scope.quantity);
			grindType = $scope.grindTypeCustom;
		}
		$http.post(apiPath + '/options', {
			username: $cookies.get('username'),
			weeklyTotal: weeklyTotal,
			grindType: grindType
		}).then(function successCallback(response){
			if(response.data.message="updated"){
				$location.path('/');
			}
		}, function errorCallback(response){
			console.log(response);
		});
	};
	function checkToken() {
		if($cookies.get('token')){
			$http.get(apiPath + '/getUserData?token='+ $cookies.get('token')).then(function successCallback(response){
				console.log(response);
				if(response.data.failure === 'badToken'){
					$location.path = '/login'; //Token is bad or fake. Goodbye
				}else if(response.data.failure === 'noToken'){
					$location.path('/login'); //No token. Goodbye
				}else{
					//token is good. Response.data will have their stuff in it.
					$rootScope.username = response.data.username;
					$rootScope.loggedOut = true;
				}
			}, function errorCallback(response){
				console.log(response);
			});
		}
	}
});

eComApp.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'views/main.html',
		controller: 'mainController'
	});
	$routeProvider.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'mainController'
	});
	$routeProvider.when('/register', {
		templateUrl: 'views/register.html', 
		controller: 'mainController'
	});
	$routeProvider.when('/options', {
		templateUrl: 'views/selection.html',
		controller: 'mainController'
	}).otherwise({
		redirectTo: '/'
	});
});