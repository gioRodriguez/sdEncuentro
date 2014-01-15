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
		'mobiscrollEs' : 'js/lib/mobiscroll/js/i18n/mobiscroll.i18n.es.min',
		'date-es' : 'js/lib/date/date-es-MX.min',

		// facebook
		'facebookSdk' : 'js/lib/facebook/facebook-js-sdk.min',
		'fabookPluginConnect' : 'js/lib/facebook/cdv-plugin-fb-connect.min',

		// directives
		'dateSelectorDirective' : 'js/app/directives/mobiscrollDirective.min',
		'scrollBarDirective' : 'js/app/directives/scrollBarDirective',

		// services
		'facebookService' : 'js/app/services/facebookService.min',
		'constantsService' : 'js/app/services/constantsService.min',
		'navigationService' : 'js/app/services/navigationService.min',
		'localStorageService' : 'js/app/services/localStgeService.min',
		'dataServices' : 'js/app/services/dataServices.min',
		'cordovaServices' : 'js/app/services/cordovaServices.min',

		// controllers
		'homeController' : 'js/app/controllers/HomeController.min',
		'textViewerController' : 'js/app/controllers/TextViewerController.min',
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
		'mobiscrollEs' : {
			deps : [ 'mobiscrollScroller' ]
		},
		'mobiscrollDate' : {
			deps : [ 'mobiscrollScroller', 'mobiscrollEs' ]
		},
		'fabookPluginConnect' : {
			exports : 'CDV'
		},
		'facebookSdk' : {
			deps : [ 'fabookPluginConnect' ],
			exports : 'FB'
		}
	}
});

require([ 'guiaEncuentroApp', 'localStorageService', 'navigationService',
		'dateSelectorDirective', 'homeController', 'constantsService' ],
		function(guiaEncuentroApp) {
			angular.bootstrap(document, [ 'guiaEncuentroApp' ]);
			guiaEncuentroApp.initialize();
		});