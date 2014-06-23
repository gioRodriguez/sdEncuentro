/**
 * services for interact with the data layer
 */
(function() {
  var CONSTANTS = {
    monthPosition : 1,
    dayPosition : 2
  };
  var cachedText = null;

  var textService = function(localStorageService) {
    var textServiceFactory = {};

    /**
     * selectedDate format 'yyyy-MMMM-dd'
     */
    textServiceFactory.getTextByDate = function(selectedDate) {
      var textDeferred = $.Deferred();

      if (selectedDate) {
        if (getCachedText(selectedDate)) {
          textDeferred.resolve(getCachedText(selectedDate).text);
        } else {
          window.getText(selectedDate, function(data) {
            setCachedText(selectedDate, data);

            textDeferred.resolve(data);
          });
        }
      } else {
        textDeferred.reject(exceptions.invalidAskedDateException());
      }

      return textDeferred.promise();
    };

    function getCachedText(selectedDate) {
      return getTextFromMemory(selectedDate) ||
        getTextFromStorage(selectedDate);
    }

    function getTextFromMemory(selectedDate) {
      if (cachedText &&
        cachedText.selectedDate === selectedDate) {
        return cachedText;
      } else {
        return null;
      }
    }

    function getTextFromStorage(selectedDate) {
      cachedText = localStorageService.getText();
      return getTextFromMemory(selectedDate);
    }

    function setCachedText(selectedDate, data) {
      localStorageService.saveText(selectedDate, data);
      cachedText = {
        'selectedDate' : selectedDate,
        'text' : data
      };
    }

    return textServiceFactory;
  };

  angular.module('guiaEncuentroApp').factory('textService', [
    'localStorageService',
    textService
  ]);
})();