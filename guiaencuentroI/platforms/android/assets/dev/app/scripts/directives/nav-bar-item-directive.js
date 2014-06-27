(function() {
  'use strict';
  
  var illyumNavBarItemDirective = function() {
  
    return {
      restrict : 'EA',
      transclude : true,
      require : '^illyumNavBar',
      scope : {
        doClick : '&',
        disabled : '=isDisabled',
        constratEnabled : '=isConstratEnabled',
        icon : '@icon'       
      },
      templateUrl : 'views/templates/navItemTemplate.html',
      link : function(scope, element, attrs, illyumNavBarController) {
        scope.itemSize = illyumNavBarController.getItemSize();
      }
    };
  };
  
  angular.module('guiaEncuentroApp').directive('illyumNavBarItem', illyumNavBarItemDirective);
})();