/**
 * UI services
 */
define([ 'sdEncuentro' ], function(sdEncuentro) {
	var navService = function($navigate) {
		var navFactory = {};
		navFactory.slidePage = function(path, type) {
			$navigate.go(path, type);
		};

		navFactory.back = function() {
			$navigate.back();
		};
		return navFactory;
	}

	sdEncuentro.factory('navigationService', navService);
});