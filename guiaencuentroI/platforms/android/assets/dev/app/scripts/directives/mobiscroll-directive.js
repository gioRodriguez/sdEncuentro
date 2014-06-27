/**
 * mobiscroll directive
 */
(function() {
  var mobiscrollDirective = function() {
    return {
      restrict : 'EA',
      require : '?ngModel',
      link : function(scope, element, attrs, ngModel) {
        var dateSelector = $(element).scroller({
          preset : 'date',
          dateOrder : 'ddMyy',
          theme : 'ios',
          dateFormat : 'yyyy-MMMM-dd',
          lang : 'es',
          onSelect : function() {
            scope.$apply(function() {
              ngModel.$setViewValue($(element).val());
            });
          },
          onBeforeShow : function(ints) {
            ints.setDate(Date.parse(scope.selectedDate));
          }
        });
      }
    };
  };

  angular.module('guiaEncuentroApp').directive('illyumDateSelector', [
    mobiscrollDirective
  ]);
})();