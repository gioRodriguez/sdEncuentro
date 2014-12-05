/*
 * Home model factory
 */
(function(){
  'use strict';
  angular.module('guiaEncuentroApp').factory('HomeModelFacty', [
    'userSettingsService', 
    'navigationService',
    'cordovaServices',
    'HomeFormTranslatorFcty',
    function HomeModelFacty(
        userSettingsService,
        navigationService,
        cordovaServices,
        HomeFormTranslatorFcty
    ){
      HomeModelFacty.formInfo = {};
      
      HomeModelFacty.getSelectedDayAndMonth = function(){
        return userSettingsService.getSelectedDayAndMonth();
      };   
      
      HomeModelFacty.getSelectedYear = function(){
        return userSettingsService.getSelectedYear();
      };
      
      HomeModelFacty.getSelectedFullDate = function() {
        return userSettingsService.getSelectedFullDate();
      };
      
      HomeModelFacty.setFormInfo = function(homeFormInfo){
        HomeModelFacty.formInfo = homeFormInfo;
        return HomeModelFacty;
      };
      
      HomeModelFacty.setSelectedDayAndMonth = function(selectedDayAndMonth){
        userSettingsService.saveSelectedDayAndMonth(selectedDayAndMonth);
      };
      
      HomeModelFacty.goToSettingsPage = function(){
        navigationService.slidePage('/settings');
      };
      
      HomeModelFacty.goToTextViewerPage = function(selectedDate){
        if(HomeModelFacty.formInfo.valid){
          navigationService.slidePage('/textViewer/' + selectedDate); 
        } else {
          
        }
      };
      
      HomeModelFacty.showError = function(fieldName){
        return HomeModelFacty.formInfo[HomeFormTranslatorFcty.fieldsTable[fieldName]].$invalid;
      };
      
      return HomeModelFacty;
    }
  ]);  
})();