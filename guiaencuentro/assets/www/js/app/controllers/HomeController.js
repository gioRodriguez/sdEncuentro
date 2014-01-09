/**
 * Home Controller
 */

define([ 'sdEncuentro' ], function(sdEncuentro) {

	var homeController = function($scope, navigationService) {
		$scope.slidePage = function(path, type) {
			navigationService.slidePage(path, type);
		};
	};

	sdEncuentro.controller('HomeController', [ '$scope', 'navigationService',
			homeController ]);
})