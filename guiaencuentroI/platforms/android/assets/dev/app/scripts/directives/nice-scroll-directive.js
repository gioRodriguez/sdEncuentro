/**
 * 
 */
(function() {
  var niceScrollDirective = function($timeout, $window, localStorageService) {

    var niceScrollDirectiveFactory = {};
    var oldHeight;
    var oldY;

    niceScrollDirectiveFactory.run = function(scope, element, attrs) {
      $timeout(function() {
        $timeout(function() {
          $(element).niceScroll();          

          goToPreiousReadPosition();

          // save the position each time that the user do a scroll
          // for retrieved it when the user come back
          $(element).getNiceScroll()[0].scrollend(function() {
            localStorageService.saveReadPosition({
              date : scope.selectedDate,
              value : $(element).getNiceScroll()[0].getScrollTop()
            });
          });
        });
      });

      function goToPreiousReadPosition() {
        var readPosition = localStorageService.getReadPosition();
        var isContinueReadingActive = localStorageService.isContinueReadingActive();
        if (readPosition &&
          readPosition.date == scope.selectedDate &&
          isContinueReadingActive) {
          $(element).getNiceScroll().doScrollPos(0, readPosition.value);
        }
      }

      scope.$on('resize:prepare', function() {
        oldHeight = $(element).getNiceScroll()[0].getContentSize().h;
        oldY = $(element).getNiceScroll()[0].getScrollTop();
      });

      scope.$on('resize', function() {
        $(element).getNiceScroll().resize();

        var newHeight = $(element).getNiceScroll()[0].getContentSize().h;
        var newY = (newHeight * oldY) /
          oldHeight;

        $(element).getNiceScroll().doScrollPos(0, newY);
      });
    };

    return {
      link : niceScrollDirectiveFactory.run
    };
  };

  angular.module('guiaEncuentroApp').directive('niceScroll', [
    '$timeout',
    '$window',
    'localStorageService',
    niceScrollDirective
  ]);
})();