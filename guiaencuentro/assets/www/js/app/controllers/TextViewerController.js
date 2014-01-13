/**
 * Home Controller
 */

define([ 'guiaEncuentroApp'], function(guiaEncuentroApp) {

	var textViewerController = function($scope, navigationService) {
		var FONT_SIZES = [ 'xx-small', 'x-small', 'small', 'medium', 'large',
				'x-large', 'xx-large' ];
		var MAX_FONT_SIZE = FONT_SIZES.length;
		var currentFontSize = 2;
		setFontSize(FONT_SIZES[currentFontSize]);

		$scope.applyPlusDisabled = applyPlusDisabled();
		function applyPlusDisabled() {
			return currentFontSize + 1 >= MAX_FONT_SIZE;
		}

		$scope.applyMinDisabled = applyMinDisabled();
		function applyMinDisabled() {
			return currentFontSize - 1 < 0;
		}

		$scope.back = function(path, type) {
			navigationService.back();
		};

		function setFontSize(fontSize) {
			$scope.fontSize = fontSize;
		}

		$scope.plusFontSize = function() {
			if (!applyPlusDisabled()) {
				$scope.applyMinDisabled = false;
				currentFontSize = currentFontSize + 1;
				setFontSize(FONT_SIZES[currentFontSize]);
			}
			$scope.applyPlusDisabled = applyPlusDisabled();
		}

		$scope.minFontSize = function() {
			if (!applyMinDisabled()) {
				$scope.applyPlusDisabled = false;
				currentFontSize = currentFontSize - 1;
				setFontSize(FONT_SIZES[currentFontSize]);
			}
			$scope.applyMinDisabled = applyMinDisabled();
		}
	};

	guiaEncuentroApp.controller('TextViewerController', [ '$scope',
			'navigationService', textViewerController ]);
})