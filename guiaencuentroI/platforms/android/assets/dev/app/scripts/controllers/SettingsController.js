(function() {
  var settingsController =
    function(
        $scope,
        navigationService,
        $translate,
        localStorageService,
        constantsService,
        cordovaServices,
        facebookService) {

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
        localStorageService.set(
            constantsService.preferredLanguageKey,
            $scope.preferredLanguage);
      };

      $scope.exit = function() {
        cordovaServices.exitApp();
      };

      $scope.removeFacebookAccount = function() {
        facebookService.hasActiveAccount().then(function() {
            facebookService.logout().then(
              function() {
                cordovaServices.alert(
                    $translate('accountAlertMsg'),
                    $translate('accountAlertTitle'),
                    $translate('publishOk'));
              });
        }, function(error) {
          if(error && error.isNetworkException){
            cordovaServices.alert(
                $translate('notNetworkDesc'),
                $translate('notNetworkTitle'),
                $translate('publishOk'));
          } else {
            cordovaServices.alert(
                $translate('notAccountAlertMsg'),
                $translate('accountAlertTitle'),
                $translate('publishOk'));
          }          
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
    settingsController
  ]);
})();