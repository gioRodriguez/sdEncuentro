define([ "guiaEncuentroApp" ], function(guiaEncuentroApp) {
	var settingsController = function($scope, navigationService) {
		$scope.back = function() {
			navigationService.back()
		}
	};
	guiaEncuentroApp.controller("SettingsController", [ "$scope",
			"navigationService", settingsController ])
});