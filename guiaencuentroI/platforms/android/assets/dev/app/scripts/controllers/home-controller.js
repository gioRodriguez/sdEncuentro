/**
 * Home Controller
 */
(function() {
  var homeController =
    function (
        HomeModelFacty,
        HomeFormTranslatorFcty        
    ) {
      var vm = this;
      
      vm.selectedDayAndMonth = HomeModelFacty.getSelectedDayAndMonth();
      
      vm.goToSettingsPage = function(path, type) {
        HomeModelFacty.goToSettingsPage();
      };
      
      vm.getSelectedFullDate = function(path, type) {
        return HomeModelFacty.getSelectedFullDate();
      };
      
      vm.goToTextViewerPage = function() {
        HomeModelFacty
          .setFormInfo(HomeFormTranslatorFcty.translate(vm.homeForm))
          .goToTextViewerPage(vm.getSelectedFullDate());
      };

      vm.setSelectedDayAndMonth = function() {
        HomeModelFacty.setSelectedDayAndMonth(vm.selectedDayAndMonth);
      };
      
      vm.showError = function(fieldName){
        return HomeModelFacty
          .setFormInfo(HomeFormTranslatorFcty.translate(vm.homeForm))
          .showError(fieldName);
      }
    };

  angular.module('guiaEncuentroApp').controller('HomeController', [
    'HomeModelFacty',
    'HomeFormTranslatorFcty',
    homeController
  ]);
  
  angular.module('guiaEncuentroApp').factory('HomeFormTranslatorFcty', [
    function HomeFormTranslatorFcty(
    )
    {
      HomeFormTranslatorFcty.fieldsTable = {
        selectedDateName: 'selectedDate'
      };
      
      HomeFormTranslatorFcty.infoForm;
      
      HomeFormTranslatorFcty.translate = function(homeForm){
        if(HomeFormTranslatorFcty.infoForm){
          return HomeFormTranslatorFcty.infoForm;
        }
        
        var infoForm = {
          valid: homeForm.$valid,
          invalid: homeForm.$invalid
        };
        
        Object.keys(HomeFormTranslatorFcty.fieldsTable).forEach(function(key){
          infoForm[HomeFormTranslatorFcty.fieldsTable[key]] = homeForm[key]
        });      
        
        HomeFormTranslatorFcty.infoForm = infoForm;        
        return infoForm;
      }
    
    return HomeFormTranslatorFcty
  }]);
})();