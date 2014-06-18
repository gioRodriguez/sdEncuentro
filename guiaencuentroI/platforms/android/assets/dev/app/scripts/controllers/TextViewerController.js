/**
 * Home Controller
 */
(function() {
  var textViewerController =
    function(
        $scope,
        navigationService,
        localStorageService,
        constantsService,
        textService,
        cordovaServices,
        $translate,
        facebookService,
        usSpinnerService,
        $timeout) {

      var FONT_SIZES = [
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
      var MAX_FONT_SIZE = FONT_SIZES.length;
      var indexPreferredFontSize;

      function init() {
        loadUserPreferredFontSize();
        loadUserContrast();
        loadSelectedText();
        enableDisableMinPlusFont();

        $scope.disableFacebook = false;
      }

      function loadUserContrast() {
        $scope.constratEnabled = localStorageService.get('constratEnabled');
      }

      $scope.setContrast = function() {
        if ($scope.constratEnabled) {
          $scope.constratEnabled = false;
        } else {
          $scope.constratEnabled = true;
        }
        localStorageService.set('constratEnabled', $scope.constratEnabled);
      }

      function enableDisableMinPlusFont() {
        isDisabledPlusFontSize();
        isDisabledMinFontSize();
      }

      function loadUserPreferredFontSize() {
        var fontSizeStored = localStorageService.get('fontSize');
        indexPreferredFontSize =
          fontSizeStored != null ? fontSizeStored : constantsService.defaultFontSize;
        $scope.userPreferredFontSize = FONT_SIZES[indexPreferredFontSize];
      }

      function setFontSize() {
        $scope.userPreferredFontSize = FONT_SIZES[indexPreferredFontSize];
        localStorageService.set('fontSize', indexPreferredFontSize);
      }

      function loadSelectedText() {
        $scope.selectedDate = localStorageService.get(constantsService.selectedDateKey);
        textService.getTextByDate($scope.selectedDate).done(function(data) {
          usSpinnerService.stop('readSpin');
          $scope.text = data;          
        }).fail(
            function(data) {
              usSpinnerService.stop('readSpin');
              cordovaServices.alert(
                  $translate('textAskedFailDesc'),
                  $translate('textAskedFailTitle'),
                  $translate('publishOk'));
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
        $scope.$broadcast('resize:prepare');
        
        if (!$scope.disablePlusFontSize) {
          indexPreferredFontSize++;
          setFontSize();
        }
        enableDisableMinPlusFont();  
        
        $timeout(function() {
          $scope.$broadcast('resize');
        });        
      }

      $scope.minFontSize = function() {
        $scope.$broadcast('resize:prepare');
        
        if (!$scope.disableMinFontSize) {
          indexPreferredFontSize--;
          setFontSize();
        }
        enableDisableMinPlusFont();
        
        $timeout(function() {
          $scope.$broadcast('resize');
        }); 
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
                cordovaServices.alert(
                    $translate('publishFacebook'),
                    $translate('publishTitle'),
                    $translate('publishOk'));
              },
              function(error) {
                enableFacebook();
                if (error.isNetworkException) {
                  cordovaServices.alert(
                      $translate('notNetworkDesc'),
                      $translate('notNetworkTitle'),
                      $translate('publishOk'));
                } else {
                  cordovaServices.alert(
                      $translate('publishFail'),
                      $translate('publishTitle'),
                      $translate('publishOk'));
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

      $scope.twitterPublish =
        function() {
          var text = 'twitter test';
          if (text) {
            twitterService.publish(text).then(
                function() {
                  cordovaServices.alert(
                      $translate('publishTwitter'),
                      $translate('publishTitle'),
                      $translate('publishOk'));
                },
                function() {
                  cordovaServices.alert(
                      $translate('publishFail'),
                      $translate('publishTitle'),
                      $translate('publishOk'));
                });
          }
        };

      $scope.exit = function() {
        cordovaServices.exitApp();
      };

      init();
    };

  angular.module('guiaEncuentroApp').controller('TextViewerController', [
    '$scope',
    'navigationService',
    'localStorageService',
    'constantsService',
    'textService',
    'cordovaServices',
    '$translate',
    'facebookService',
    'usSpinnerService',
    '$timeout',
    textViewerController
  ]);
})();