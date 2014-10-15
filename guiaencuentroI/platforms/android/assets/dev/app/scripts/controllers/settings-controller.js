(function() {
  var settingsController =
    function (
        SettingsModelFacty
    ) {

      var vm = this;
      
      vm.hideSaraiMessage = true;
      vm.preferredLanguage =  SettingsModelFacty.getUserPreferredLanguage();
      vm.isContinueReadingActive = SettingsModelFacty.isContinueReadingActive();
      
      vm.changePreferredLanguage = function() {
        SettingsModelFacty.setUserPreferredLanguage(vm.preferredLanguage);
      };

      vm.removeFacebookAccount = function() {
        SettingsModelFacty.removeFacebookAccount();
      };

      vm.turnOnTurnOffContinueReading = function() {
        SettingsModelFacty.turnOnTurnOffContinueReading();
      };
      
      vm.showSaraiMessage = function() {
        vm.hideSaraiMessage = SettingsModelFacty.isSaraiMessageVisible();
      }

      vm.init = function() {
       SettingsModelFacty.init();
      };
    };

  angular.module('guiaEncuentroApp').controller("SettingsController", [
    'SettingsModelFacty',
    settingsController
  ]);
})();