/**
 * Home Controller
 */
(function() {
  var textViewerController =
    function(
        $scope,
        usSpinnerService,
        $timeout,
        $routeParams,
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
      
      vm.init = function() {
        $timeout(function() {
          TextViewerModelFacty.init($routeParams.selectedDateParam)
            .then(function(){
              vm.userPreferredFontSize = TextViewerModelFacty.getUserPreferredFontSize();
              vm.selectedDate = TextViewerModelFacty.getSelectedDate();
              vm.text = TextViewerModelFacty.getText();

              usSpinnerService.stop('readSpin');
              $timeout(function(){
                scrollService.applyScroll();
              });
            });
        });

        vm.disableFacebook = false;
      }
      
      vm.onScroll = function(){
        $scope.$apply(function(){
          TextViewerModelFacty.showFooter();
          TextViewerModelFacty.hideFooterSlowly();
          console.log(TextViewerModelFacty.isFooterVisible());
        });        
      }
      
      vm.isHigthConstrastEnabled = function(){
        return TextViewerModelFacty.isHigthConstrastEnabled();
      }

      vm.setContrast = function() {
        TextViewerModelFacty.turnOnTurnOffHigthConstrast();
      }

      vm.plusFontSize = function() {
        scrollService.prepareResize();
        
        TextViewerModelFacty.plusMinFont(true)
          .then(function(){
            vm.userPreferredFontSize = TextViewerModelFacty.getUserPreferredFontSize();
            vm.disableMinFontSize = TextViewerModelFacty.isDisableMinFontSize();
            vm.disablePlusFontSize = TextViewerModelFacty.isDisablePlusFontSize();
            
            $timeout(function() {
              scrollService.resize();
            });
          });
      }

      vm.minFontSize = function() {
        scrollService.prepareResize();
        
        TextViewerModelFacty.plusMinFont(false)
          .then(function(){
            vm.userPreferredFontSize = TextViewerModelFacty.getUserPreferredFontSize();
            vm.disableMinFontSize = TextViewerModelFacty.isDisableMinFontSize();
            vm.disablePlusFontSize = TextViewerModelFacty.isDisablePlusFontSize();
            
            $timeout(function() {
              scrollService.resize();
            });
          });
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
    };

  angular.module('guiaEncuentroApp').controller('TextViewerController', [
    '$scope',
    'usSpinnerService',
    '$timeout',
    '$routeParams',
    'scrollService',
    'TextViewerModelFacty',
    textViewerController
  ]);
})();