define([ "guiaEncuentroApp" ], function(guiaEncuentroApp) {
	var settingsController = function($scope, navigationService, $translate,
			localStorageService, constantsService) {
		$scope.back = function() {
			navigationService.back()
		}

		$scope.preferredLanguage = $translate.uses();
		$scope.language = function() {
			$translate.uses($scope.preferredLanguage);
			localStorageService.set(constantsService.preferredLanguageKey,
					$scope.preferredLanguage);
		}
	};
	guiaEncuentroApp.controller("SettingsController", [ "$scope",
			"navigationService", '$translate', 'localStorageService',
			'constantsService', settingsController ])
});