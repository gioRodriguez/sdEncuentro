define([ "guiaEncuentroApp" ], function(guiaEncuentroApp) {
	var settingsController = function(
			$scope,
			navigationService,
			$translate,
			localStorageService,
			constantsService,
			cordovaServices) {
		
		$scope.back = function() {
			navigationService.back()
		};

		$scope.preferredLanguage = $translate.uses();
		$scope.changePreferredLanguage = function() {
			
			// change the translate used language
			$translate.uses($scope.preferredLanguage);
			
			// persist user preferred language
			localStorageService.set(constantsService.preferredLanguageKey,
					$scope.preferredLanguage);
		};

		$scope.exit = function() {
			cordovaServices.exitApp();
		};
	};
	guiaEncuentroApp.controller("SettingsController", [
			"$scope",
			"navigationService",
			'$translate',
			'localStorageService',
			'constantsService',
			'cordovaServices',
			settingsController ])
});