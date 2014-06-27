(function() {
  'use strict';

  var illyumNavBarDirective =
    function() {

      return {
        transclude : true,
        restrict : 'EA',
        template : '<div style="bottom: -0.5rem;" class="topcoat-navigation-bar ng-class:{highContrast: constratEnabled}"> <span ng-transclude></span> </div>',
        scope : {
          constratEnabled : '=isConstratEnabled',
          itemSize : '@itemsSize'
        },
        controller : [
          '$scope',
          function($scope) {
            this.getItemSize = function() {
              return $scope.itemSize;
            };
          }
        ],
        link : function(scope, element, attrs) {

        }
      }
    };

  angular.module('guiaEncuentroApp').directive('illyumNavBar', [
    illyumNavBarDirective
  ]);
})();