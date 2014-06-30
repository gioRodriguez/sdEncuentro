(function() {
  var settingsController =
    function(
        $scope,
        navigationService,
        $translate,
        cordovaServices,
        facebookService,
        userSettingsService,
        dialogService) {

      var CONSTANTS = {
        clickToShowSaraiMessage : 3
      };

      var clicksToShowSaraiMessageCount = 0;

      $scope.back = function() {
        navigationService.back()
      };

      $scope.preferredLanguage = $translate.uses();
      $scope.changePreferredLanguage =
        function() {

          // change the translate used language
          $translate.uses($scope.preferredLanguage);

          // persist user preferred language
          userSettingsService.savePreferredLanguage($scope.preferredLanguage);
        };

      $scope.exit = function() {
        cordovaServices.exitApp();
      };

      $scope.removeFacebookAccount =
        function() {
          facebookService.hasActiveAccount().then(
              function() {
                facebookService.logout().then(
                    function() {
                      dialogService.showInfo('accountAlertMsg');
                    });
              },
              function(error) {
                if (error &&
                  error.isNetworkException) {
                  dialogService.showError('notNetworkDesc');
                } else {
                  dialogService.showInfo('notAccountAlertMsg');
                }
              });
        };

      $scope.turnOnTurnOffContinueReading = function() {
        if($scope.isContinueReadingActive){
          userSettingsService.turnOnContinueReading();
        } else {
          userSettingsService.turnOffContinueReading();
        }
      };

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

        $scope.isContinueReadingActive = userSettingsService.isContinueReadingEnabled();
      };
    };

  angular.module('guiaEncuentroApp').controller("SettingsController", [
    "$scope",
    "navigationService",
    '$translate',
    'cordovaServices',
    'facebookService',
    'userSettingsService',
    'dialogService',
    settingsController
  ]);
})();