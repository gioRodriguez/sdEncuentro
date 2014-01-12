/**
 * Sd Encuentro App
 */

'use strict';

define(function() {
	var guiaEncuentroApp = angular.module('guiaEncuentroApp', [ 'ngRoute',
			'ngTouch', 'ajoslin.mobile-navigate', 'pascalprecht.translate' ]);

	// routes config
	guiaEncuentroApp.config([ '$routeProvider', '$translateProvider',
			function($routeProvider, $translateProvider) {
				$routeProvider.when('/', {
					templateUrl : 'js/app/views/HomeView.html',
					controller : 'HomeController'
				});
				$routeProvider.when('/textViewer', {
					templateUrl : 'js/app/views/TextViewerView.html',
					controller : 'TextViewerController'
				});
				$routeProvider.when("/settings", {
					templateUrl : "js/app/views/SettingsView.html",
					controller : "SettingsController"
				});
				$routeProvider.otherwise({
					redirectTo : '/'
				});

				// i18n
				$translateProvider.translations('es', {
					homeTitle : "Guia encuentro",
					settingsTitle : "Opciones"
				});

				$translateProvider.translations('en', {
					homeTitle : "Meet guie",
					settingsTitle : "Settings"
				});

				$translateProvider.preferredLanguage('es');
			} ]);

	guiaEncuentroApp.initialize = function() {
		bindEvents();
	};

	function bindEvents() {
		document.addEventListener('deviceready', onDeviceReady, false);
	}

	function onDeviceReady() {
		FastClick.attach(document.body);
	}

	return guiaEncuentroApp;
});