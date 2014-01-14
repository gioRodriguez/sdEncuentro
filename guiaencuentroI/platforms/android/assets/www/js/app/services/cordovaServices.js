/**
 * Apache cordova services
 */

define([ 'guiaEncuentroApp' ], function(guiaEncuentroApp) {
	
	var cordovaServices = function() {
		var cordovaServicesFactory = {};

		cordovaServicesFactory.alert = function(message, title, buttonLabels) {
			navigator.notification.alert(message, null, title, buttonName);
		};

		return cordovaServicesFactory;
	};

	guiaEncuentroApp.factory('cordovaServices', cordovaServices);
});