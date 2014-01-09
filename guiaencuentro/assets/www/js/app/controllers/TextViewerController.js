/**
 * Home Controller
 */

define([ 'sdEncuentro' ], function(sdEncuentro) {

	var textViewerController = function($scope, navigationService) {
		$scope.back = function(path, type) {
			navigationService.back();
		};
	};

	sdEncuentro.controller('TextViewerController', [ '$scope',
			'navigationService', textViewerController ]);
})