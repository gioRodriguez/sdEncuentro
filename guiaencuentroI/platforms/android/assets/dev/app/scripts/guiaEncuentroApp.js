/**
 * Sd Encuentro App
 */

'use strict';

define(function() {
	var guiaEncuentroApp = angular.module('guiaEncuentroApp', [ 'ngRoute',
			'ngTouch', 'ajoslin.mobile-navigate', 'pascalprecht.translate',
			'ngSanitize' ]);

	// routes config
	guiaEncuentroApp
			.config([
					'$routeProvider',
					'$translateProvider',
					function($routeProvider, $translateProvider) {
						$routeProvider.when('/', {
							templateUrl : 'views/HomeView.html',
							controller : 'HomeController'
						});
						$routeProvider.when('/textViewer', {
							templateUrl : 'views/TextViewerView.html',
							controller : 'TextViewerController'
						});
						$routeProvider.when("/settings", {
							templateUrl : "views/SettingsView.html",
							controller : "SettingsController"
						});
						$routeProvider.otherwise({
							redirectTo : '/'
						});

						// i18n
						$translateProvider
								.translations(
										'es',
										{
											homeTitle : "Guia encuentro",
											selectionDate : 'Fecha de lectura deseada:',
											settingsTitle : 'Opciones',
											goReading : 'Ir a lectura',
											welcome : 'Jesús les dijo: Yo soy el pan de la vida; el que viene a mí no tendrá hambre, y el que cree en mí nunca tendrá sed (Juan 6:35)',
											spanish : 'Español',
											english : 'Ingles',
											publishTitle : 'Compartido',
											publishFacebook : 'Copartido en fabebook gracias :)',
											publishTwitter : 'Copartido en twitter gracias :)',
											publishFail : 'Lo sentimos ha ocurrido un error :(',
											publishOk : 'Aceptar'
										});

						$translateProvider
								.translations(
										'en',
										{
											homeTitle : "Meet guie",
											selectionDate : 'Choise a date:',
											settingsTitle : 'Settings',
											goReading : 'Go to reading',
											welcome : 'Then Jesus declared, “I am the bread of life. Whoever comes to me will never go hungry, and whoever believes in me will never be thirsty (John :35 )',
											spanish : 'Spanish',
											english : 'English',
											publishTitle : 'Publish',
											publishFacebook : 'Shared in facebook thank you :)',
											publishTwitter : 'Shared in twitter thank you :)',
											publishFail : "We're so sorry an error has been occurred :(",
											publishOk : 'Ok'
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