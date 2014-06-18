/**
 * service for access to the local storage
 */
(function() {
	var constantsService = function() {
		var constantsFactory = {};

		// keys
		constantsFactory.selectedDateKey = 'selectedDate';
		constantsFactory.preferredLanguageKey = 'preferredLanguage';
		
		// defaults
		constantsFactory.preferredLanguageDefault = 'es';
		constantsFactory.dateFormat = 'yyyy-MMMM-dd';
		constantsFactory.defaultFontSize = 3;
		
		constantsFactory.continueReadActive = true;

		return constantsFactory;
	};
	
	angular.module('guiaEncuentroApp').factory('constantsService', constantsService);
})();