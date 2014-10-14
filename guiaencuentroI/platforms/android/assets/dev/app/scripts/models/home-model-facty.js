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
      
      HomeModelFacty.getSelectedDate = function(){
        return userSettingsService.getSelectedDate();
      }           
      
      HomeModelFacty.setFormInfo = function(homeFormInfo){
        HomeModelFacty.formInfo = homeFormInfo;
        return HomeModelFacty;
      }
      
      HomeModelFacty.setSelectedDate = function(selectedDate){
        userSettingsService.saveSelectedDate(selectedDate);
      }
      
      HomeModelFacty.goToSettingsPage = function(){
        navigationService.slidePage('/settings');
      }
      
      HomeModelFacty.goToTextViewerPage = function(selectedDate){
        if(HomeModelFacty.formInfo.valid){
          navigationService.slidePage('/textViewer/' + selectedDate); 
        } else {
          
        }
      }
      
      HomeModelFacty.showError = function(fieldName){
        return HomeModelFacty.formInfo[HomeFormTranslatorFcty.fieldsTable[fieldName]].$invalid;
      }
      
      return HomeModelFacty;
    }
  ]);  
})();