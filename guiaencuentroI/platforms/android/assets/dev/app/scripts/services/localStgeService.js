/**
 * service for access to the local storage
 */
(function() {
  var localStgeService =
    function() {
      var localStgeServiceFactory = {};

      localStgeServiceFactory.saveText = function(selectedDate, text) {
        localStorage.setItem('text', JSON.stringify({
          'selectedDate' : selectedDate,
          'text' : text
        }));
      };
      
      localStgeServiceFactory.getText = function() {
        return JSON.parse(localStorage.getItem('text'));
      };
      
      localStgeServiceFactory.saveReadPosition = function(readPosition) {
        if (readPosition) {
          localStgeServiceFactory.set('readPosition', readPosition);
        }
      };

      localStgeServiceFactory.getReadPosition = function(readPosition) {
        return JSON.parse(localStorage.getItem('readPosition'));
      };

      localStgeServiceFactory.isContinueReadingActive =
        function() {
          var isContinueReadingActive =
            localStgeServiceFactory.get('isContinueReadingActive');
          if (isContinueReadingActive) {
            return isContinueReadingActive.isContinueReadingActive
          }

          return true;
        };

      localStgeServiceFactory.persistContinueReadingActive =
        function(isContinueReadingActive) {
          localStorage.setItem('isContinueReadingActive', JSON.stringify({
            'isContinueReadingActive' : isContinueReadingActive
          }));
        };

      localStgeServiceFactory.set = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
      };

      localStgeServiceFactory.get = function(key) {
        return JSON.parse(localStorage.getItem(key));
      };

      return localStgeServiceFactory;
    };

  angular.module('guiaEncuentroApp').factory('localStorageService', localStgeService);
})();