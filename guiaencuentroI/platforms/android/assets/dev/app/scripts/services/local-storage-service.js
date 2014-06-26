/**
 * service for access to the local storage
 */
(function() {
  var localStgeService =
    function() {
      var localStgeServiceFactory = {};

      localStgeServiceFactory.set = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
      };

      localStgeServiceFactory.get = function(key) {
        var item = localStorage.getItem(key);
        return item != 'undefined' && item ? JSON.parse(item) : '';
      };

      return localStgeServiceFactory;
    };

  angular.module('guiaEncuentroApp').factory('localStorageService', localStgeService);
})();