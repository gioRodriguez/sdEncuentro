/**
 * mobiscroll directive
 */

define([ 'guiaEncuentroApp', 'zepto', 'mobiscrollDate' ], function(
		guiaEncuentroApp, $) {

	var mobiscrollDirective = function($timeout, constantsService) {
		var mobiscrollDirectiveFactory = {};
		var mEmelent = null;
		var mScope = null;
		var mNgModel = null;
		mobiscrollDirectiveFactory.run = function(scope, element, attrs,
				ngModel) {
			mEmelent = element;
			mScope = scope;
			mNgModel = ngModel;
			$timeout(function() {
				var illyumDateSelector = $('.illyumDateSelector');
				var dateSelector = illyumDateSelector.scroller({
					preset : 'date',
					dateOrder : 'ddMyy',					
					theme : 'ios',
					dateFormat : constantsService.dateFormat,
					lang : 'es',
					onSelect : function() {
						mScope.$apply(function() {
							mNgModel.$setViewValue(mEmelent.val());
						});
					},
					onBeforeShow: function(ints) {
						ints.setDate(Date.parse(mEmelent.val()));
					}
				});
			});
		};

		return {
			require : '?ngModel',
			link : mobiscrollDirectiveFactory.run
		};
	};

	guiaEncuentroApp.directive('illyumDateSelector', [ '$timeout',
			'constantsService', mobiscrollDirective ]);

});