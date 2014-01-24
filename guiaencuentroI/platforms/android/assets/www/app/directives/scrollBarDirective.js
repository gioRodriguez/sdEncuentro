/**
 * mobiscroll directive
 */

define([ 'guiaEncuentroApp', 'zepto' ], function(
		guiaEncuentroApp, $) {

	var scrollBarDirective = function($timeout, constantsService) {
		var scrollBarDirectiveFactory = {};
		var mEmelent = null;
		scrollBarDirectiveFactory.run = function(scope, element, attrs, ngModel) {
			mEmelent = element;		
			$timeout(function() {
											
			});
		};

		return {
			link : scrollBarDirectiveFactory.run
		};
	};

	guiaEncuentroApp.directive('scrollBarDirective', [ '$timeout',
			'constantsService', scrollBarDirective ]);

});