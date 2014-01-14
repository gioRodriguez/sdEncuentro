/**
 * service for access to the local storage
 */
define([ 'guiaEncuentroApp' ], function(guiaEncuentroApp) {
	var constantsService = function() {
		var constantsFactory = {};

		constantsFactory.selectedDateKey = 'selectedDate';
		constantsFactory.dateFormat = 'yyyy-MMMM-dd';
		constantsFactory.defaultFontSize = 2;

		return constantsFactory;
	};

	guiaEncuentroApp.factory('constantsService', constantsService);
});