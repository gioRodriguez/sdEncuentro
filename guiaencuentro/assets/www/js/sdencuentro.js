/**
 * Sd Encuentro App
 */

'use strict';

define([ 'js/lib/fastclick' ], function() {
	var sdEncuentroApp = angular.module('SdEncuentro', [ 'ngRoute', 'ngTouch',
			'ajoslin.mobile-navigate' ]);

	// routes config
	sdEncuentroApp.config([ '$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl : 'js/app/views/HomeView.html',
			controller : 'HomeController'
		});
		$routeProvider.when('/textViewer', {
			templateUrl : 'js/app/views/TextViewerView.html',
			controller : 'TextViewerController'
		});
		$routeProvider.otherwise({
			redirectTo : '/'
		});
	} ]);

	sdEncuentroApp.initialize = function() {
		bindEvents();
	};

	function bindEvents() {
		document.addEventListener('deviceready', onDeviceReady, false);
	}

	function onDeviceReady() {
		FastClick.attach(document.body);
	}

	return sdEncuentroApp;
});