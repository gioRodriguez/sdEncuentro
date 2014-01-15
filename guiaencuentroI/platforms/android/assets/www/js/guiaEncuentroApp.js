/**
 * Sd Encuentro App
 */

'use strict';

define(function() {
	var guiaEncuentroApp = angular.module('guiaEncuentroApp', [ 'ngRoute',
			'ngTouch', 'ajoslin.mobile-navigate', 'pascalprecht.translate', 'ngSanitize' ]);

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
					selectionDate : 'Fecha de lectura deseada:',
					settingsTitle : 'Opciones',
					goReading : 'Ir a lectura'
				});

				$translateProvider.translations('en', {
					homeTitle : "Meet guie",
					selectionDate : 'Choise a date:',
					settingsTitle : 'Settings',
					goReading : 'Go to reading'
				});

				$translateProvider.preferredLanguage('es');
			} ]);

	guiaEncuentroApp.run([
			'localStorageService',
			'constantsService',
			function(localStorageService, constantsService) {
				localStorageService.set(constantsService.selectedDateKey,
						new Date().toString(constantsService.dateFormat));
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