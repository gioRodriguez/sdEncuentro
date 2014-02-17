'use strict';

define('app', function() {
	angular.module('yeomanApp', [ 'ngSanitize', 'ngRoute' ]).config(
			function($routeProvider) {
				$routeProvider.when('/', {
					templateUrl : 'views/main.html',
					controller : 'MainCtrl'
				}).otherwise({
					redirectTo : '/'
				});
			});
	
	return angular.module('yeomanApp', []);
});
