(function() {
  'use strict';
  
  var illyumNavBarItemDirective = function() {
  
    return {
      restrict : 'EA',
      transclude : true,
      require : '^illyumNavBar',
      scope : {
        constratEnabled : '=isConstratEnabled',
        icon : '@icon',
        ngDisabled: '=ngDisabled'
      },
      templateUrl : 'views/templates/navItemTemplate.html',
      link : function(scope, element, attrs, illyumNavBarController) {
        scope.itemSize = illyumNavBarController.getItemSize();
      }
    };
  };
  
  angular.module('guiaEncuentroApp').directive('illyumNavBarItem', [illyumNavBarItemDirective]);
})();