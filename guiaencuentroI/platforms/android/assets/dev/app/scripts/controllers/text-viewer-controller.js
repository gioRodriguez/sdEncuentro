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
        dialogService,
        scrollService,
        TextViewerModelFacty) {

      $scope.isShowFooter = function(){
        return TextViewerModelFacty.isFooterVisible();
      };
      
      $scope.showFooter = function (){
        TextViewerModelFacty.showFooter();
      }
      
      $scope.showHideFooter = function (){
        TextViewerModelFacty.showHideFooter();
      }
      
      function init() {
        $timeout(function() {
          $scope.userPreferredFontSize = TextViewerModelFacty.getUserPreferredFontSize();
          
          $scope.constratEnabled = TextViewerModelFacty.isHigthConstrastEnabled();
          
          usSpinnerService.stop('readSpin');
          $scope.selectedDate = $routeParams.selectedDateParam;
          TextViewerModelFacty.getTextByDate($routeParams.selectedDateParam)
          .then(function(){
            $scope.text = TextViewerModelFacty.text;
            
            usSpinnerService.stop('readSpin');
            $timeout(function(){
              scrollService.applyScroll();
            });
          });
          
          
          TextViewerModelFacty.init();
        });

        $scope.disableFacebook = false;
      }
      
      $scope.onScroll = function(){
        $scope.$apply(function(){
          TextViewerModelFacty.showFooter();
          TextViewerModelFacty.hideFooterSlowly();
        });        
      }
      
      $scope.isHigthConstrastEnabled = function(){
        return TextViewerModelFacty.isHigthConstrastEnabled();
      }

      $scope.setContrast = function() {
        TextViewerModelFacty.turnOnTurnOffHigthConstrast();
      }

      $scope.plusFontSize = function() {
        var result = TextViewerModelFacty.plusMinFont(true);
        
        $scope.userPreferredFontSize = result.fontSize;
        $scope.disableMinFontSize = result.disableMinFontSize;
        $scope.disablePlusFontSize = result.disablePlusFontSize;
      }

      $scope.minFontSize = function() {
        var result = TextViewerModelFacty.plusMinFont(false);
        
        $scope.userPreferredFontSize = result.fontSize;
        $scope.disableMinFontSize = result.disableMinFontSize;
        $scope.disablePlusFontSize = result.disablePlusFontSize;
      }

      $scope.facebookPublish = function() {
        $scope.disableFacebook = true;
        usSpinnerService.spin('publishSpin');

        TextViewerModelFacty.facebookPublish()
          .then(function(){
            usSpinnerService.stop('publishSpin');
            $timeout(function() {
              $scope.disableFacebook = false;
            });
          })
          .then(null, function(){
            usSpinnerService.stop('publishSpin');
            $timeout(function() {
              $scope.disableFacebook = false;
            });
          });
      };

      init();
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
    'scrollService',
    'TextViewerModelFacty',
    textViewerController
  ]);
})();