/**
 * Home Controller
 */
(function() {
  var textViewerController =
    function(
        $scope,
        navigationService,
        textService,
        cordovaServices,
        $translate,
        facebookService,
        usSpinnerService,
        $timeout,
        $routeParams,
        userSettingsService,
        dialogService) {

      var FONT_SIZES = [
        '0.5rem', // the cero position is not valid
        '0.5rem',
        '1rem',
        '1.5rem',
        '2rem',
        '2.5rem',
        '3rem',
        '3.5rem',
        '4rem',
        '4.5rem',
        '5rem'
      ];
      var MIN_FONT_SIZE = 1;
      var MAX_FONT_SIZE = FONT_SIZES.length;
      var indexPreferredFontSize;

      function init() {
        $timeout(function() {
          loadUserPreferredFontSize();
          loadHighConstrast();
          loadSelectedText();
        });

        $scope.disableFacebook = false;
      }

      function loadHighConstrast() {
        $scope.constratEnabled = userSettingsService.isHighConstrastEnabled();
      }

      $scope.setContrast = function() {
        if ($scope.constratEnabled) {
          $scope.constratEnabled = false;
          userSettingsService.turnOffHighConstrast();
        } else {
          $scope.constratEnabled = true;
          userSettingsService.turnOnHighConstrast();
        }
      }

      function loadUserPreferredFontSize() {
        indexPreferredFontSize = userSettingsService.getPreferedFontSize();
        $scope.userPreferredFontSize = FONT_SIZES[indexPreferredFontSize];
      }

      function loadSelectedText() {
        $scope.selectedDate = $routeParams.selectedDateParam;
        textService.getTextByDate($scope.selectedDate).done(function(data) {
          usSpinnerService.stop('readSpin');
          $scope.text = data;
        }).fail(
            function(data) {
              usSpinnerService.stop('readSpin');
              dialogService.showError('textAskedFailDesc');
            });
      }

      $scope.back = function(path, type) {
        navigationService.back();
      };

      $scope.plusFontSize = function() {
        plusMinFont(true);
      }

      function plusMinFont(isPlus) {
        $scope.$broadcast('resize:prepare');

        if (isPlus &&
          !$scope.disablePlusFontSize) {
          indexPreferredFontSize++;
        }

        if (!isPlus &&
          !$scope.disableMinFontSize) {
          indexPreferredFontSize--;
        }

        $scope.userPreferredFontSize = FONT_SIZES[indexPreferredFontSize];

        $timeout(function() {
          $scope.$broadcast('resize');
        });
      }

      $scope.minFontSize = function() {
        plusMinFont(false);
      }

      $scope.facebookPublish =
        function() {
          var text = getTextForPublish();
          if (!text) {
            return;
          }

          $scope.disableFacebook = true;
          usSpinnerService.spin('publishSpin');

          var publication = {
            message : text,
            link : $translate('publicationLink'),
            picture : $translate('publicationPicture'),
            name : $translate('publicationAppName'),
            caption : $translate('publicationAppCaption')
          };

          facebookService.publish(publication).then(
              function() {
                enableFacebook();
                dialogService.showInfo('publishFacebook');
              },
              function(error) {
                enableFacebook();
                if (error.isNetworkException) {
                  dialogService.showError('notNetworkDesc');
                } else {
                  dialogService.showError('publishFail');
                }
              });
        };

      function enableFacebook() {
        usSpinnerService.stop('publishSpin');
        $timeout(function() {
          $scope.disableFacebook = false;
        });
      }

      function getTextForPublish() {
        if ($scope.text) {
          textToPublish = getReadBodyText($scope.text);
          return String(textToPublish).replace(/<[^>]+>/gm, '#s').replace(/(#s)+/gm, ' ')
              .substring(0, 600) +
            '...';
        }
        return null;
      }

      function getReadBodyText(text) {
        if (text.indexOf("readBoby")) {
          return text.split("readBoby'>")[1];
        }

        return text;
      }

      $scope.exit = function() {
        cordovaServices.exitApp();
      };

      init();

      $scope.$watch('userPreferredFontSize', function() {
        if (indexPreferredFontSize) {
          userSettingsService.savePreferedFontSize(indexPreferredFontSize);
          $scope.disablePlusFontSize = indexPreferredFontSize + 1 >= MAX_FONT_SIZE;
          $scope.disableMinFontSize = indexPreferredFontSize - 1 < MIN_FONT_SIZE;
        }
      });
    };

  angular.module('guiaEncuentroApp').controller('TextViewerController', [
    '$scope',
    'navigationService',
    'textService',
    'cordovaServices',
    '$translate',
    'facebookService',
    'usSpinnerService',
    '$timeout',
    '$routeParams',
    'userSettingsService',
    'dialogService',
    textViewerController
  ]);
})();