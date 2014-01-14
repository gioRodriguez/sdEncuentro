/**
 * UI services
 */
define([ 'guiaEncuentroApp' ], function(guiaEncuentroApp) {
	var navService = function($navigate) {
		var navFactory = {};
		navFactory.slidePage = function(path, type) {
			$navigate.go(path, type);
		};

		navFactory.back = function() {
			$navigate.back();
		};
		return navFactory;
	};

	guiaEncuentroApp.factory('navigationService', ['$navigate', navService]);
});