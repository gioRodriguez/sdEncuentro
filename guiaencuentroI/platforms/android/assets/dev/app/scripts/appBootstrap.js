/**
 * 
 */ 
(function() {
	angular.module('guiaEncuentroApp').run([
			'userSettingsService',
			function(userSettingsService) {
			  userSettingsService.saveSelectedDate(new Date().toString('yyyy-MMMM-dd'));
			} ]);
})();