/**
 * Home Controller
 */

define([ 'guiaEncuentroApp', 'settingsController', 'textViewerController' ],
		function(guiaEncuentroApp) {

			var homeController = function($scope, navigationService,
					localStorageService, constantsService) {

				$scope.slidePage = function(path, type) {
					navigationService.slidePage(path, type);
				};

				var selectedDate = localStorageService
						.get(constantsService.selectedDateKey);
				$scope.selectedDate = selectedDate;

				$scope.setSelectedDate = function() {
					localStorageService.set(constantsService.selectedDateKey,
							$scope.selectedDate);
				};
			};

			guiaEncuentroApp.controller('HomeController', [ '$scope',
					'navigationService', 'localStorageService',
					'constantsService', homeController ]);
		})