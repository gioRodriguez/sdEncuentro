/**
 * 
 */ 
(function() {
	angular.module('guiaEncuentroApp').run([
			'localStorageService',
			'constantsService',
			function(localStorageService, constantsService) {
				localStorageService.set(constantsService.selectedDateKey, new Date()
						.toString(constantsService.dateFormat));
			} ]);
})();