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

      var vm = this;
      
      vm.isShowFooter = function(){
        return TextViewerModelFacty.isFooterVisible();
      };
      
      vm.showFooter = function (){
        TextViewerModelFacty.showFooter();
      }
      
      vm.showHideFooter = function (){
        TextViewerModelFacty.showHideFooter();
      }
      
      function init() {
        $timeout(function() {
          vm.userPreferredFontSize = TextViewerModelFacty.getUserPreferredFontSize();
          
          vm.constratEnabled = TextViewerModelFacty.isHigthConstrastEnabled();
          
          usSpinnerService.stop('readSpin');
          vm.selectedDate = $routeParams.selectedDateParam;
          TextViewerModelFacty.getTextByDate($routeParams.selectedDateParam)
          .then(function(){
            vm.text = TextViewerModelFacty.text;
            
            usSpinnerService.stop('readSpin');
            $timeout(function(){
              scrollService.applyScroll();
            });
          });
          
          
          TextViewerModelFacty.init();
        });

        vm.disableFacebook = false;
      }
      
      vm.onScroll = function(){
        $scope.$apply(function(){
          TextViewerModelFacty.showFooter();
          TextViewerModelFacty.hideFooterSlowly();
        });        
      }
      
      vm.isHigthConstrastEnabled = function(){
        return TextViewerModelFacty.isHigthConstrastEnabled();
      }

      vm.setContrast = function() {
        TextViewerModelFacty.turnOnTurnOffHigthConstrast();
      }

      vm.plusFontSize = function() {
        var result = TextViewerModelFacty.plusMinFont(true);
        
        vm.userPreferredFontSize = result.fontSize;
        vm.disableMinFontSize = result.disableMinFontSize;
        vm.disablePlusFontSize = result.disablePlusFontSize;
      }

      vm.minFontSize = function() {
        var result = TextViewerModelFacty.plusMinFont(false);
        
        vm.userPreferredFontSize = result.fontSize;
        vm.disableMinFontSize = result.disableMinFontSize;
        vm.disablePlusFontSize = result.disablePlusFontSize;
      }

      vm.facebookPublish = function() {
        vm.disableFacebook = true;
        usSpinnerService.spin('publishSpin');

        TextViewerModelFacty.facebookPublish()
          .then(function(){
            usSpinnerService.stop('publishSpin');
            $timeout(function() {
              vm.disableFacebook = false;
            });
          })
          .then(null, function(){
            usSpinnerService.stop('publishSpin');
            $timeout(function() {
              vm.disableFacebook = false;
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