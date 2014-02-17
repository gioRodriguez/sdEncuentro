/**
 * Home Controller
 */

define([ 'guiaEncuentroApp' ], function(guiaEncuentroApp) {
	var homeController = function($scope) {
		$scope.selectedDate = '2/16/2011';
	};

	guiaEncuentroApp.controller('HomeController3', [ '$scope', homeController ]);
})