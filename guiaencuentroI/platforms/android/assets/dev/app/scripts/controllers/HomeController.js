/**
 * Home Controller
 */

define([ 'guiaEncuentroApp', 'dateSelectorDirective' ], function(
		guiaEncuentroApp) {
	var homeController = function(
			$scope,
			navigationService,
			localStorageService,
			constantsService,
			cordovaServices) {

		$scope.slidePage = function(path, type) {
			navigationService.slidePage(path, type);
		};

		var selectedDate = localStorageService
				.get(constantsService.selectedDateKey);
		$scope.selectedDate = selectedDate;

		$scope.persistSelectedDate = function() {
			localStorageService.set(
					constantsService.selectedDateKey,
					$scope.selectedDate);
		};

		$scope.exit = function() {
			cordovaServices.exitApp();
		};
	};

	guiaEncuentroApp.controller('HomeController', [
			'$scope',
			'navigationService',
			'localStorageService',
			'constantsService',
			'cordovaServices',
			homeController ]);
})