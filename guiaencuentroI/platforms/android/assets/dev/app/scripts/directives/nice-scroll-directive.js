/**
 * 
 */
(function() {
  var niceScrollDirective =
    function($timeout, $window, userSettingsService) {

      var oldHeight;
      var oldY;
  

      return {
        scope: {
          selectedDate: '=',
          onScroll: '='
        },
        link : function(scope, element, attrs) {

          function goToPreiousReadPosition() {
            var readPosition = userSettingsService.getTextPosition();
            var isContinueReadingActive = userSettingsService.isContinueReadingEnabled();
            if (readPosition &&
              readPosition.date == scope.selectedDate &&
              isContinueReadingActive) {
              $(element).getNiceScroll().doScrollPos(0, readPosition.value);
            }
          }
          
          scope.$on('scroll:apply', function(){
            $(element).niceScroll();
            
            $(element).getNiceScroll()[0].scrollstart(function() {
              if(scope.onScroll){
                scope.onScroll();
              }
            });

            goToPreiousReadPosition();

            // save the position each time that the user do a scroll
            // for retrieved it when the user come back
            $(element).getNiceScroll()[0].scrollend(function() {
              userSettingsService.saveTextPosition(scope.selectedDate, $(element)
                  .getNiceScroll()[0].getScrollTop());
            });
          });

          scope.$on('resize:prepare', function() {
            oldHeight = $(element).getNiceScroll()[0].getContentSize().h;
            oldY = $(element).getNiceScroll()[0].getScrollTop();
          });

          scope.$on('resize', function() {
            $(element).getNiceScroll().resize();

            if($(element).getNiceScroll()[0]){
              var newHeight = $(element).getNiceScroll()[0].getContentSize().h;
              var newY = (newHeight * oldY) /
                oldHeight;

              $(element).getNiceScroll().doScrollPos(0, newY);
            }
          });
                    
        }
      };
    };

  angular.module('guiaEncuentroApp').directive('niceScroll', [
    '$timeout',
    '$window',
    'userSettingsService',
    niceScrollDirective
  ]);
  
  angular.module('guiaEncuentroApp').factory('scrollService', ['$rootScope', function($rootScope){
    return {
      applyScroll: function(scrollId){
        $rootScope.$broadcast('scroll:apply', [scrollId]);
      },
      prepareResize: function(){
        $rootScope.$broadcast('resize:prepare');
      },
      resize: function(){
        $rootScope.$broadcast('resize');
      }
    };
  }]);
})();