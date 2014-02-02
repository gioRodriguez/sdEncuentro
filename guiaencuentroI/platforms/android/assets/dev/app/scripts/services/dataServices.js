/**
 * services for interact with the data layer
 */
define([ 'guiaEncuentroApp'], function(guiaEncuentroApp) {
	var dataServices = function($http) {
		var dataServicesFactory = {};

		/**
		 * selectedDate format 'yyyy-MMMM-dd'
		 */
		dataServicesFactory.getTextByDate = function(selectedDate) {
			var textDeferred = $.Deferred();
			window.getText(selectedDate, function(text) {
				textDeferred.resolve(text);
			}, function() {
				textDeferred.reject();
			});
			return textDeferred.promise();
		};

		return dataServicesFactory;
	};

	guiaEncuentroApp.factory('dataServices', [ '$http', dataServices ]);
});