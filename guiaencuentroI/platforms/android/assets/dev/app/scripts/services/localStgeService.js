/**
 * service for access to the local storage
 */
(function() {
	var localStgeService = function() {
		var localStgeServiceFactory = {};

		localStgeServiceFactory.set = function(key, value) {
			localStorage.setItem(key, JSON.stringify(value));
		}

		localStgeServiceFactory.get = function(key) {
			return JSON.parse(localStorage.getItem(key));
		}

		return localStgeServiceFactory;
	};
	
	angular.module('guiaEncuentroApp').factory('localStorageService', localStgeService);
})();