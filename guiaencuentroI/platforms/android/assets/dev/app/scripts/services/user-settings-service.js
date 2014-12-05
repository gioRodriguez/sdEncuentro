(function() {
  'use strict';
  
  var userSettingsService = function(localStorageService) {
    var CONSTANTS = {
      selectedYearKey : 'selectedYear',
      
      selectedDateKey : 'selectedDate',

      preferredLanguageKey : 'preferredLanguage',
      preferredLanguageDefault : 'es',

      preferedFontSizeKey : 'fontSize',
      defaultFontSize : 4,

      isHighConstratEnabledKey : 'isHighConstratEnabled',
      dateFormat : 'yyyy-MMMM-dd',

      continueReadActive : true
    };

    var userSettingsFactory = {};

    /**
     * text position
     */
    userSettingsFactory.getTextPosition = function() {
      return localStorageService.get('readPosition');
    };

    userSettingsFactory.saveTextPosition = function(selectedDate, textPosition) {
      localStorageService.set('readPosition', {
        date : selectedDate,
        value : textPosition
      });
    };

    /**
     * Continue reading
     */
    userSettingsFactory.isContinueReadingEnabled = function() {
      var isContinueReadingActive = localStorageService.get('isContinueReadingActive');
      if (isContinueReadingActive) {
        return isContinueReadingActive.isContinueReadingActive;
      }

      return true;
    };

    userSettingsFactory.turnOnContinueReading = function() {
      localStorageService.set('isContinueReadingActive', {
        'isContinueReadingActive' : true
      });
    };

    userSettingsFactory.turnOffContinueReading = function() {
      localStorageService.set('isContinueReadingActive', {
        'isContinueReadingActive' : false
      });
    };

    /**
     * Preferred language
     */
    userSettingsFactory.savePreferredLanguage = function(preferredLanguage) {
      localStorageService.set(CONSTANTS.preferredLanguageKey, preferredLanguage);
    };

    /**
     * Font size
     */
    userSettingsFactory.getPreferedFontSize = function() {
      var fontSize = localStorageService.get(CONSTANTS.preferedFontSizeKey);
      return fontSize ? fontSize : CONSTANTS.defaultFontSize;
    };

    userSettingsFactory.savePreferedFontSize = function(preferedFontSize) {
      localStorageService.set(CONSTANTS.preferedFontSizeKey, preferedFontSize);
    };

    /**
     * High constrast
     */
    userSettingsFactory.isHighConstrastEnabled = function() {
      return localStorageService.get(CONSTANTS.isHighConstratEnabledKey) === true;
    };

    userSettingsFactory.turnOffHighConstrast = function() {
      localStorageService.set(CONSTANTS.isHighConstratEnabledKey, false);
    };

    userSettingsFactory.turnOnHighConstrast = function() {
      localStorageService.set(CONSTANTS.isHighConstratEnabledKey, true);
    };

    /**
     * Selected date
     */
    userSettingsFactory.getSelectedDayAndMonth = function() {
      return localStorageService.get(CONSTANTS.selectedDateKey);
    };

    userSettingsFactory.saveSelectedDayAndMonth = function(selectedDate) {
      localStorageService.set(CONSTANTS.selectedDateKey, selectedDate);
    };
    
    /**
     * Selected year 
     */
    userSettingsFactory.getSelectedYear = function(){
      return localStorageService.get(CONSTANTS.selectedYearKey);
    }
    
    userSettingsFactory.saveSelectedYear = function(selectedYear){
      return localStorageService.set(CONSTANTS.selectedYearKey, selectedYear);
    }
    
    /**
     * Selected full date 
     */
    userSettingsFactory.getSelectedFullDate = function(){
      return localStorageService.get(CONSTANTS.selectedYearKey) + '-' + localStorageService.get(CONSTANTS.selectedDateKey);
    }

    return userSettingsFactory;
  };

  angular.module('guiaEncuentroApp').factory('userSettingsService', [
    'localStorageService',
    userSettingsService
  ]);
})();