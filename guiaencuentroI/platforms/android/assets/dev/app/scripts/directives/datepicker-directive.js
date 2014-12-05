/**
 * mobiscroll directive
 */
(function() {
  var illyumDatepicker = function(userSettingsService) {
    return {
      restrict : 'EA',
      require : '?ngModel',
      scope: false,
      link : function(scope, element, attrs, ngModel) {
        var dateSelector = $(element).scroller({
          preset : 'date',
          dateOrder : 'ddMM',
          theme : 'ios',
          dateFormat : 'MMMM-dd',
          lang : 'es',
          onSelect : function() {               
            scope.$apply(function() {
              ngModel.$setViewValue($(element).val());
            });
          },
          onBeforeShow : function(ints) {
            ints.setDate(Date.parse(ngModel.$viewValue));
          }
        });
      }
    };
  };

  angular.module('guiaEncuentroApp').directive('illyumDatepicker', [
    'userSettingsService', illyumDatepicker
  ]);
})();