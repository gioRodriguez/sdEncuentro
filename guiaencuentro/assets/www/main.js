/**
 * Require configuration
 */
"use strict";

require.config({
	paths : {
		'guiaEncuentroApp' : 'js/guiaEncuentroApp.min',
		'jquery' : 'js/lib/jquery/jquery-1.10.2.min',
		'zepto' : 'js/lib/zepto/zepto.min',
		'mobiscrollZepto' : 'js/lib/mobiscroll/js/mobiscroll.zepto.min',
		'mobiscrollCore' : 'js/lib/mobiscroll/js/mobiscroll.core.min',
		'mobiscrollScroller' : 'js/lib/mobiscroll/js/mobiscroll.scroller.min',
		'mobiscrollDate' : 'js/lib/mobiscroll/js/mobiscroll.datetime.min',
		'date-es' : 'js/lib/date/date-es-MX.min',

		// directives
		'dateSelectorDirective' : 'js/app/directives/mobiscrollDirective.min',

		// services
		'navigationService' : 'js/app/services/navigation-service.min',

		// controllers
		'homeController' : 'js/app/controllers/HomeController.min',
		'settingsController' : 'js/app/controllers/SettingsController.min'
	},
	shim : {
		'zepto' : {
			exports : '$'
		},
		'mobiscrollScroller' : {
			deps : [ 'mobiscrollCore', 'date-es' ]
		},
		'mobiscrollCore' : {
			deps : [ 'mobiscrollZepto' ]
		},
		'mobiscrollDate' : {
			deps : [ 'mobiscrollScroller' ]
		}
	}
});

require([ 'guiaEncuentroApp', 'navigationService', 'dateSelectorDirective',
		'homeController' ], function(guiaEncuentroApp) {
	angular.bootstrap(document, [ 'guiaEncuentroApp' ]);
	guiaEncuentroApp.initialize();
});