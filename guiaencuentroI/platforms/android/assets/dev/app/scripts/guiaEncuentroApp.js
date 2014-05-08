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
											homeTitle : "Plan encuentro",
											selectionDate : 'Fecha de lectura deseada:',
											settingsTitle : 'Opciones',
											accounts : 'Cuentas',
											deleteFacebookAccount : 'Remover facebook',
											accountAlertTitle : 'cuenta',
											accountAlertMsg : 'sesión cerada',
											about : 'Acerca de',
											poweredBy : 'Powered por ',
											toSarai : 'Especial dedicación a Saraí :)',
											goReading : 'Ir a lectura',
											welcome : 'Escudriñad las Escrituras; porque a vosotros os parece que en ellas tenéis la vida eterna; y ellas son las que dan testimonio de mí (Juan 5:39)',
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
											homeTitle : "Meet plan",
											selectionDate : 'Choise a date:',
											settingsTitle : 'Settings',
											accounts : 'Accounts',
											deleteFacebookAccount : 'Remove facebook',
											accountAlertTitle: 'Account',
											accountAlertMsg: 'Account closed',	
											about : 'About',
											poweredBy : 'Powered by ',
											goReading : 'Go to reading',
											toSarai : 'Speccially dedicated to Sarai :)',
											welcome : 'You study the Scriptures diligently because you think that in them you have eternal life. These are the very Scriptures that testify about me (John 5:39)',
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