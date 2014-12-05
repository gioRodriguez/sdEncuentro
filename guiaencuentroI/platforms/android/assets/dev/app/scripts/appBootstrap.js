/**
 * 
 */ 
(function() {
	angular.module('guiaEncuentroApp').run([
			'userSettingsService',
			function(userSettingsService) {			  			  
			  var todayValues = Date.today().toString('yyyy-MMMM-dd').split('-');
			  var selectedYear = userSettingsService.getSelectedYear();
			  
			  var year = selectedYear || todayValues[0];
			  var month = todayValues[1].substring(0, 1).toUpperCase() + todayValues[1].substring(1, todayValues[1].length);
			  var day = todayValues[2];
			  
			  userSettingsService.saveSelectedYear(year);
			  userSettingsService.saveSelectedDayAndMonth(month + '-' + day);
			} ]);
})();