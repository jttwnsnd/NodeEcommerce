/*global angular:true */
var eComApp = angular.module('ecommerceApp', []);
var eController = eComApp.controller('ecommerceController', function($scope, $http){
	$scope.test = 'yo';
})