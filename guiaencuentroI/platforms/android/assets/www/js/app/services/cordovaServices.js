/**
 * Apache cordova services
 */

define([ 'guiaEncuentroApp' ], function(guiaEncuentroApp) {
	
	var cordovaServices = function() {
		var cordovaServicesFactory = {};
		
		function alertDismised() {
			
		}

		cordovaServicesFactory.alert = function(message, title, buttonLabels) {
			navigator.notification.alert(message, alertDismised, title, buttonLabels);
		};
		
		cordovaServicesFactory.exitApp = function() {
			navigator.app.exitApp();
		};

		return cordovaServicesFactory;
	};

	guiaEncuentroApp.factory('cordovaServices', cordovaServices);
});