/*global angular:true */
/*global console:true */
var eComApp = angular.module('ecommerceApp', ['ngRoute', 'ngCookies']);
var eController = eComApp.controller('mainController', function($scope, $rootScope, $http, $location, $cookies){
	$scope.test = 'yo';
	$scope.userExists = false;
	var apiPath = 'http://localhost:3000';
	$scope.register = function() {
		console.log($scope.username);
		$http.post(apiPath + '/register', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response) {
			console.log(response.data);
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
				$rootScope.loggedOut = true;
				$location.path('/options');
			}
		}, function errorCallbacl(response) {
			console.log(response);
		});
	};
	$scope.login = function(){
		$http.post(apiPath + '/login', {
			username: $scope.username,
			password: $scope.password,
		}).then(function successCallback(response) {
			// console.log(response);
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
				console.log($rootScope.loggedOut);
				$location.path('/options');
			}
			if(response.data.failure === 'noUser'){
				console.log('Incorrect password');
			}
		}, function errorCallbacl(response) {
			console.log(response);
		});
	};
	$scope.logout = function(){
		$rootScope.loggedOut = true;
	};
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
	}).otherwise({
		redirectTo: '/'
	});
});