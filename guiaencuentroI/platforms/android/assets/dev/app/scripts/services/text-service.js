/**
 * services for interact with the data layer
 */
(function() {
  var CONSTANTS = {
    monthPosition : 1,
    dayPosition : 2
  };
  var textService = function() {
    var textServiceFactory = {};

    /**
     * selectedDate format 'yyyy-MMMM-dd'
     */
    textServiceFactory.getTextByDate = function(selectedDate) {
      var textDeferred = $.Deferred();
      if (selectedDate) {
        $.ajax({
          url : askedText(selectedDate),
          dataType : 'text',
          success : function(text) {
            textDeferred.resolve(text);
          },
          error : function() {
            textDeferred.reject();
          }
        });
      } else {
        textDeferred.reject(exceptions.invalidAskedDateException());
      }

      return textDeferred.promise();
    };

    return textServiceFactory;
  };

  function askedText(selectedDate) {
    return 'texts/' +
      month(selectedDate) +
      '/' +
      month(selectedDate) +
      day(selectedDate) +
      '.txt';
  }

  function month(selectedDate) {
    var dateSplited = selectedDate.split('-');
    return dateSplited[CONSTANTS.monthPosition].toLowerCase();
  }

  function day(selectedDate) {
    var dateSplited = selectedDate.split('-');
    var day = dateSplited[CONSTANTS.dayPosition];
    if (day < 10) {
      day = day.substr(day.length - 1, day.length);
    }

    return day;
  }

  angular.module('guiaEncuentroApp').factory('textService', [
    textService
  ]);
})();