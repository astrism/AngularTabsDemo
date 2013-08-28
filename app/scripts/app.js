'use strict';

var airpair = angular.module('airpairApp', []);

airpair.config(function($routeProvider) {
	
	$routeProvider.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl'
	});

	$routeProvider.otherwise({
		redirectTo: '/'
	});
});