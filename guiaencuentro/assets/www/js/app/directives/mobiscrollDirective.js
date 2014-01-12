/**
 * mobiscroll directive
 */

define([ 'guiaEncuentroApp', 'zepto', 'mobiscrollDate' ], function(
		guiaEncuentroApp, $) {
	guiaEncuentroApp.directive('illyumDateSelector', [ '$timeout',
			function($timeout) {
				return {
					link : function(scope, element, attrs) {
						$timeout(function() {
							var illyumDateSelector = $('.illyumDateSelector');
							var curr = new Date().getFullYear();
							illyumDateSelector.scroller({
								preset : 'date',
								dateOrder : 'd Dmmyy',
								theme : 'ios'
							});
						});
					}
				};
			} ]);
});