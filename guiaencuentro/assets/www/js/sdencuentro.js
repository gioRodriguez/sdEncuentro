/**
 * Sd Encuentro App
 */

'use strict';

define([ 'js/lib/fastclick' ], function() {
	var sdEncuentroApp = angular.module('SdEncuentro', [ 'ngRoute', 'ngTouch',
			'ajoslin.mobile-navigate', 'pascalprecht.translate' ]);

	// routes config
	sdEncuentroApp.config([ '$routeProvider', '$translateProvider',
			function($routeProvider, $translateProvider) {
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
				
				// i18n
				$translateProvider.translations('es', {
					'TITLE' : 'Guia encuentro'
				});
				
				$translateProvider.translations('en', {
					'TITLE' : 'Meet guie'
				});
				
				$translateProvider.preferredLanguage('es');
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