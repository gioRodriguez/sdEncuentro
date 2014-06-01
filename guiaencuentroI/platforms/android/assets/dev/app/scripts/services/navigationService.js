/**
 * UI services
 */
(function() {
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
	
	angular.module('guiaEncuentroApp').factory('navigationService', ['$navigate', navService]);
})();