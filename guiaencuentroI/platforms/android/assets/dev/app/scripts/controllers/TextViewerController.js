/**
 * Home Controller
 */

define([
		'guiaEncuentroApp',
		'scrollBarDirective',
		'dataServices',
		'facebookService',
		'twitterService' ], function(guiaEncuentroApp) {
	var textViewerController = function(
			$scope,
			navigationService,
			localStorageService,
			constantsService,
			dataServices,
			cordovaServices,
			$translate,
			facebookService,
			twitterService) {

		var FONT_SIZES = [
				'xx-small',
				'x-small',
				'small',
				'medium',
				'large',
				'x-large',
				'xx-large' ];
		var MAX_FONT_SIZE = FONT_SIZES.length;
		var indexPreferredFontSize;

		function init() {
			loadUserPreferredFontSize();
			loadSelectedText();
			enableDisableMinPlusFont();
		}

		function enableDisableMinPlusFont() {
			isDisabledPlusFontSize();
			isDisabledMinFontSize();
		}

		function loadUserPreferredFontSize() {
			var fontSizeStored = localStorageService.get('fontSize');
			indexPreferredFontSize = fontSizeStored != null ? fontSizeStored
					: constantsService.defaultFontSize;
			$scope.userPreferredFontSize = FONT_SIZES[indexPreferredFontSize];
		}

		function setFontSize() {
			$scope.userPreferredFontSize = FONT_SIZES[indexPreferredFontSize];
			localStorageService.set('fontSize', indexPreferredFontSize);
		}

		function loadSelectedText() {
			$scope.selectedDate = localStorageService
					.get(constantsService.selectedDateKey);
			dataServices.getTextByDate($scope.selectedDate).done(function(data) {
				$scope.text = data;
			}).fail(function(data) {
				console.log('error: ' + data);
			});
		}

		function isDisabledPlusFontSize() {
			$scope.disablePlusFontSize = indexPreferredFontSize + 1 >= MAX_FONT_SIZE;
			return $scope.disablePlusFontSize;
		}

		function isDisabledMinFontSize() {
			$scope.disableMinFontSize = indexPreferredFontSize - 1 < 0;
			return $scope.disableMinFontSize;
		}

		$scope.back = function(path, type) {
			navigationService.back();
		};

		$scope.plusFontSize = function() {
			if (!$scope.disablePlusFontSize) {
				indexPreferredFontSize++;
				setFontSize();
			}
			enableDisableMinPlusFont();
		}

		$scope.minFontSize = function() {
			if (!$scope.disableMinFontSize) {
				indexPreferredFontSize--;
				setFontSize();
			}
			enableDisableMinPlusFont();
		}

		$scope.facebookPublish = function() {
			var text = getTextForPublish();
			if (text) {
				facebookService.publish(text).then(
						function() {
							cordovaServices.alert($translate('publishFacebook'),
									$translate('publishTitle'), $translate('publishOk'));
						},
						function() {
							cordovaServices.alert($translate('publishFail'),
									$translate('publishTitle'), $translate('publishOk'));
						});
			}

		};

		$scope.twitterPublish = function() {
			var text = getTextForPublish();
			twitterService.publish(text);
		};

		$scope.exit = function() {
			cordovaServices.exitApp();
		};

		function getTextForPublish() {
			if ($scope.text) {
				textToPublish = $scope.text.substring(0, 600) + '...';
				return String(textToPublish).replace(/<[^>]+>/gm, '');
			}
			return null;
		}

		init();
	};

	guiaEncuentroApp.controller('TextViewerController', [
			'$scope',
			'navigationService',
			'localStorageService',
			'constantsService',
			'dataServices',
			'cordovaServices',
			'$translate',
			'facebookService',
			'twitterService',
			textViewerController ]);
})