(function(){
  'use strict';
  angular.module('guiaEncuentroApp').factory('SettingsModelFacty', [
    '$translate',
    'userSettingsService',
    'facebookService',
    'dialogService',
    function SettingsModelFacty(
        $translate,
        userSettingsService,
        facebookService,
        dialogService
    ){     
      var CONSTANTS = {
        clickToShowSaraiMessage : 3
      };

      var clicksToShowSaraiMessageCount = 0;
      
      SettingsModelFacty.getUserPreferredLanguage = function(){
        return $translate.uses();
      }
      
      SettingsModelFacty.setUserPreferredLanguage = function(preferredLanguage){
        // change the translate used language
        $translate.uses(preferredLanguage);

        userSettingsService.savePreferredLanguage(preferredLanguage);
      }
      
      SettingsModelFacty.removeFacebookAccount = function(){
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
      }
      
      SettingsModelFacty.isContinueReadingActive = function(){
        return userSettingsService.isContinueReadingEnabled();
      }
      
      SettingsModelFacty.turnOnTurnOffContinueReading = function(){
        if(!userSettingsService.isContinueReadingEnabled()){
          userSettingsService.turnOnContinueReading();
        } else {
          userSettingsService.turnOffContinueReading();
        }
      }
      
      SettingsModelFacty.isSaraiMessageVisible = function(){
        clicksToShowSaraiMessageCount++;

        if (clicksToShowSaraiMessageCount >= CONSTANTS.clickToShowSaraiMessage) {
          return false;
        } else {
          return true;
        }
      }
      
      SettingsModelFacty.init = function(){
        clicksToShowSaraiMessageCount = 0;
      }

      return SettingsModelFacty;
    }
  ]);
})();