/**
 * Home Controller
 */

define([ 'guiaEncuentroApp', 'scrollBarDirective', 'dataServices', 'cordovaServices' ], function(
		guiaEncuentroApp) {

	var textViewerController = function($scope, navigationService,
			localStorageService, constantsService, dataServices, cordovaServices) {
		var FONT_SIZES = [ 'xx-small', 'x-small', 'small', 'medium', 'large',
				'x-large', 'xx-large' ];
		var MAX_FONT_SIZE = FONT_SIZES.length;

		var localFontSize = localStorageService.get('fontSize');
		var currentFontSize = localFontSize != null ? localFontSize
				: constantsService.defaultFontSize;
		setFontSize(currentFontSize);

		// load the selected text
		$scope.selectedDate = localStorageService
				.get(constantsService.selectedDateKey);
		dataServices.getTextByDate($scope.selectedDate).done(function(data) {
			$scope.text = data;
		}).fail(function(data) {
			console.log('error: ' + data);
		});

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

		function setFontSize(currentFontSize) {
			$scope.fontSize = FONT_SIZES[currentFontSize];
			localStorageService.set('fontSize', currentFontSize);
		}

		$scope.plusFontSize = function() {
			if (!applyPlusDisabled()) {
				$scope.applyMinDisabled = false;
				currentFontSize = currentFontSize + 1;
				setFontSize(currentFontSize);
			}
			$scope.applyPlusDisabled = applyPlusDisabled();
		}

		$scope.minFontSize = function() {
			if (!applyMinDisabled()) {
				$scope.applyPlusDisabled = false;
				currentFontSize = currentFontSize - 1;
				setFontSize(currentFontSize);
			}
			$scope.applyMinDisabled = applyMinDisabled();
		}

		$scope.facebookPublish = function() {
			require([ 'facebookService' ], function(FacebookService) {
				var facebookService = new FacebookService();
				var text = getTextForFacebookPublish();
				facebookService.publish(text).done(function(response) {
					if(!response.error){
						console.log(response);
						cordovaServices.alert('Publicado en facebook :)', 'notificación', 'Aceptar');
					}else{
						console.log(response.error.message);
						cordovaServices.alert('Lo sentimos ocurrio un error al publicar :(', 'notificación', 'Aceptar');
					}
				});
			});
		};

		function getTextForFacebookPublish() {
			var header = $('.readHeader ul').text().replace('\n', '').trim() + '\n';
			var read = $('.readContent').text().substring(0, 600) + "...";
			return header + read;
		}
	};

	guiaEncuentroApp.controller('TextViewerController', [ '$scope',
			'navigationService', 'localStorageService', 'constantsService',
			'dataServices', 'cordovaServices', textViewerController ]);
})