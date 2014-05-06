define([ "guiaEncuentroApp" ], function(guiaEncuentroApp) {
	var settingsController = function(
			$scope,
			navigationService,
			$translate,
			localStorageService,
			constantsService,
			cordovaServices,
			facebookService) {
		
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
				
		$scope.disableFacebookButton = true;
		$scope.ckeckFacebookButton = function() {
			facebookService.hasActiveAccount().then(function() {
				$scope.disableFacebookButton = false;
			}, function() {
				$scope.disableFacebookButton = true;
			});
		}
		
		$scope.facebookLogout = function() {
			facebookService.logout().then(function() {
				$scope.ckeckFacebookButton();
				cordovaServices.alert($translate('accountAlertMsg'),
						$translate('accountAlertTitle'), $translate('publishOk'));
			});
		}
	};
	guiaEncuentroApp.controller("SettingsController", [
			"$scope",
			"navigationService",
			'$translate',
			'localStorageService',
			'constantsService',
			'cordovaServices',
			'facebookService',
			settingsController ])
});