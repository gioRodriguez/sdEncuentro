(function() {
	var settingsController = function(
			$scope,
			navigationService,
			$translate,
			localStorageService,
			constantsService,
			cordovaServices,
			facebookService
	) {
		
		var CONSTANTS = {
			clickToShowSaraiMessage : 3
		};

		var clicksToShowSaraiMessageCount = 0;

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
			facebookService.logout().then(
					function() {
						$scope.ckeckFacebookButton();
						cordovaServices.alert($translate('accountAlertMsg'),
								$translate('accountAlertTitle'), $translate('publishOk'));
					});
		}

		$scope.hideSaraiMessage = true;
		$scope.showSaraiMessage = function() {
			clicksToShowSaraiMessageCount++;

			if (clicksToShowSaraiMessageCount >= CONSTANTS.clickToShowSaraiMessage) {
				$scope.hideSaraiMessage = false;
			} else {
				$scope.hideSaraiMessage = true;
			}
		}

		$scope.init = function() {
			clicksToShowSaraiMessageCount = 0;
			$scope.ckeckFacebookButton();
		};
	};
	
	angular.module('guiaEncuentroApp').controller("SettingsController", [
			"$scope",
			"navigationService",
			'$translate',
			'localStorageService',
			'constantsService',
			'cordovaServices',
			'facebookService',
			settingsController ]);
})();