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
		
		cordovaServicesFactory.openBrowser = function(url) {
			return window.open(url, '_blank', 'location=no');
		};
		
		function isNetworkAvailable () {
			var networkState = navigator.connection.type;
			return networkState != Connection.UNKNOWN && 
				networkState != Connection.NONE;
		};
		
		cordovaServicesFactory.isNetworkAvailableAsync = function() {
			var connectionAvailableDeferred = $.Deferred();
			$.when(isNetworkAvailable()).done(function(networkState) {
				if(networkState){
					connectionAvailableDeferred.resolve();
				} else {
					connectionAvailableDeferred.reject();
				}
			});
			
			return connectionAvailableDeferred.promise();
		};

		return cordovaServicesFactory;
	};

	guiaEncuentroApp.factory('cordovaServices', cordovaServices);
});