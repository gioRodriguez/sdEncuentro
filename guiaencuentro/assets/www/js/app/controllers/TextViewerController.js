/**
 * Home Controller
 */

define([ 'guiaEncuentroApp' ], function(guiaEncuentroApp) {

	var textViewerController = function($scope, navigationService) {
		$scope.back = function(path, type) {
			navigationService.back();
		};
	};

	guiaEncuentroApp.controller('TextViewerController', [ '$scope',
			'navigationService', textViewerController ]);
})