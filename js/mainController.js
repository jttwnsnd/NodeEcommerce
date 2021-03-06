/*global angular:true */
/*global console:true */
var eComApp = angular.module('ecommerceApp', ['ngRoute', 'ngCookies']);
var eController = eComApp.controller('mainController', function($scope, $rootScope, $http, $window, $location, $cookies){
	$scope.test = 'yo';
	$scope.userExists = false;
	var apiPath = 'http://52.34.40.208:3000';
	checkToken();
	var testSK = 'sk_test_s0Z6wAo5DRnEVbbwUeD876n1';
	var testPK = 'pk_test_ZJna4w56Eih7glMjoWk8csQA';
	var liveSK = 'sk_live_7foZ0QdZJoeKyiUvFt0YT7LA';
	var livePK = 'pk_live_drxWAZfUCsKUQUUVIOvLpbd6';

	//Modal controls
	if (($location.path() == '/') && ($cookies.get('token') == undefined)){
		setTimeout(instructionModalShow, 1000);
		function instructionModalShow(){
			$('#instruction-modal').show()
			.css({
				left: '0px',
				top: '120px',
				marginLeft: 'auto',
				marginRight: 'auto'
			});
			$('.modal-text').html('For a complete experience, register with fake information');
		};
	}else if($location.path() == '/payment'){
		setTimeout(cardNumberModal, 1000);
		function cardNumberModal(){
			$('#instruction-modal').show()
			.css({
				position: 'fixed',
				left: '10px',
				top: '165px',
				margin: '0'
			});
			$('.modal-text').html('Use Card #<br>4242 4242 4242 4242<br>to test payment. <br>Any Exp Date after current year. <br>Any CVC.');
		};
	}else{
		$('#instruction-modal').hide();
	}

	// Close modals
	$('.close-button').click(function(){
		$('#instruction-modal').hide();
	});

	//arrays for my order forms to reference
	$scope.frequencies = [
		'Weekly',
		'Bi-weekly',
		'Monthly'
	];

	$scope.states = ['AL','AK','AZ','AR','CA','CO','CT','DC','DE','FL','GA',
	'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO',
	'MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
	'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

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
			}
			if(response.data.failure === 'noUser'){
				console.log('Incorrect password');
			}
		}, function errorCallback(response) {
			console.log(response);
		});
	};
	$scope.go = function(){
		if($cookies.get('token') === undefined){
			$location.path('/login');
		}else{
			$location.path('/options');
		}
	}

	//calls Stripe for checkout
	$scope.payOrder = function() {
        $scope.errorMessage = "";

        var handler = StripeCheckout.configure({
            key: 'pk_test_ZJna4w56Eih7glMjoWk8csQA',
            image: 'css/images/brand.png',
            locale: 'auto',
            token: function(token) {

                console.log("The token Id is: ");
                console.log(token.id);
                $http.post(apiPath + '/stripe', {
                    amount: $cookies.get('total') * 100,
                    stripeToken: token.id,
                    token: $cookies.get('token')
                        //This will pass amount, stripeToken, and token to /payment
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.success === 'Yess!') {
                        //Say thank you
                        $location.path('/receipt');
                    } else {
                        $scope.errorMessage = response.data.message;
                        //same on the checkout page
                        $location.path('/receipt');
                    }
                }, function errorCallback(response) {
                	console.log(response);
                });
            }
        });
        handler.open({
            name: 'DC Roasters',
            description: 'A Better Way To Grind',
            amount: $scope.total * 100
        });
    };
	
	//Log out
	$scope.logout = function(){
		$rootScope.loggedOut = true;
		$cookies.put('token', '');
		$cookies.remove('token');
		$cookies.remove('username');
		$cookies.remove('document');
		$window.location.reload();
		if($location.url() !== '/'){
			$location.path('/');
		}
	};

	//select your options and submit them to Mongo
	$scope.optionsForm = function(form){
		var weeklyTotal, grindType, assignFrequency, amount;
		if(form === 1){
			assignFrequency = 'Weekly';
			weeklyTotal = '7.00';
			amount = '0.35';
			grindType = $scope.grindTypeSolo;
		}else if(form === 2){
			assignFrequency = 'Weekly';
			amount = '0.9';
			weeklyTotal = '18.00';
			grindType = $scope.grindTypeFamily;
		}else{
			assignFrequency = $scope.frequency;
			amount = $scope.quantity;
			weeklyTotal = String(20 * $scope.quantity);
			grindType = $scope.grindTypeCustom;
		}
		$http.post(apiPath + '/options', {
			username: $cookies.get('username'),
			frequency: assignFrequency,
			amount: amount,
			weeklyTotal: weeklyTotal,
			grindType: grindType
		}).then(function successCallback(response){
			if(response.data.message === "updated"){
				$location.path('/delivery');
			}
		}, function errorCallback(response){
			console.log(response);
		});
	};

	//verifies the token generated and assigns data over to Angular
	function checkToken() {
		if($cookies.get('token')){
			$http.get(apiPath + '/getUserData?token='+ $cookies.get('token')).then(function successCallback(response){
				if(response.data.failure === 'badToken'){
					$location.path = '/login'; //Token is bad or fake. Goodbye
				}else if(response.data.failure === 'noToken'){
					$location.path('/login'); //No token. Goodbye
				}else{
					//token is good. Response.data will have their stuff in it.
					console.log(response.data);
					$cookies.put('total', response.data.document.weeklyTotal);
					console.log(response.data.order);
					$scope.userInfo = response.data;
					$scope.username = response.data.username;
					$rootScope.loggedOut = true;
				}
			}, function errorCallback(response){
				console.log(response);
			});
		}
	}

	//transfers data to Mongo from Delivery page
	$scope.deliverForm = function(){
		$http.post(apiPath + '/delivery', {
			username: $cookies.get('username'),
			fullName: $scope.fullName,
			address: {address1: $scope.address1, address2: $scope.address2, city: $scope.city, state: $scope.state, zipCode: $scope.zipCode}
		}).then(function successCallback(response){
			console.log(response.data.message);
			$location.path('/payment');
		}, function errorCallback(response){
			console.log(response)
		});
	};
	$scope.payment = function(){
		console.log('submitted payment');
	};
});


//routing configuration
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
	});
	$routeProvider.when('/delivery', {
		templateUrl: 'views/delivery.html',
		controller: 'mainController'
	});
	$routeProvider.when('/payment', {
		templateUrl: 'views/payment.html',
		controller: 'mainController'
	});
	$routeProvider.when('/receipt', {
		templateUrl: 'views/receipt.html',
		controller: 'mainController'
	}).otherwise({
		redirectTo: '/'
	});
});