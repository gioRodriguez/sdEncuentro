/**
 * Home Controller
 */

define([ 'guiaEncuentroApp', 'settingsController' ], function(guiaEncuentroApp) {

	var homeController = function($scope, navigationService) {
		$scope.slidePage = function(path, type) {
			navigationService.slidePage(path, type);
		};
	};

	guiaEncuentroApp.controller('HomeController', [ '$scope',
			'navigationService', homeController ]);
})