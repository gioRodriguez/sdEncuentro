/**
 * services for interact with the data layer
 */
define([ 'guiaEncuentroApp', 'zepto' ], function(guiaEncuentroApp, $) {
	var dataServices = function($http) {
		var dataServicesFactory = {};

		/**
		 * selectedDate format 'yyyy-MMMM-dd'
		 */
		dataServicesFactory.getTextByDate = function(selectedDate) {
			var selectedMonth = selectedDate.split('-')[1];
			var selectedDay = selectedDate.split('-')[2];
			return $.ajax({
				url: 'texts/' + selectedMonth + '/' + selectedMonth
				+ selectedDay + '.bh',
				dataType: 'text'
			}).then();
			
			/*return $http.get('texts/' + selectedMonth + '/' + selectedMonth
					+ selectedDay, {
				responseType : 'text'
			});*/
		};

		return dataServicesFactory;
	};

	guiaEncuentroApp.factory('dataServices', [ '$http', dataServices ]);
});