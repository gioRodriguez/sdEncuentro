/**
 * Require configuration
 */
"use strict";

require.config({
	paths : {
		'guiaEncuentroApp' : 'js/guiaEncuentroApp',
		'jquery' : 'js/lib/jquery/jquery-1.10.2.min',
		'zepto' : 'js/lib/zepto/zepto',
		'mobiscrollZepto' : 'js/lib/mobiscroll/js/mobiscroll.zepto.min',
		'mobiscrollCore' : 'js/lib/mobiscroll/js/mobiscroll.core.min',
		'mobiscrollScroller' : 'js/lib/mobiscroll/js/mobiscroll.scroller.min',
		'mobiscrollDate' : 'js/lib/mobiscroll/js/mobiscroll.datetime.min',
		'mobiscrollEs' : 'js/lib/mobiscroll/js/i18n/mobiscroll.i18n.es.min',
		'date-es' : 'js/lib/date/date-es-MX.min',

		// twitter
		'jsOAuth' : 'js/lib/jsOAuth/jsOAuth-1.3.6.min',
		'codebird' : 'js/lib/codebird/codebird',

		// facebook
		'facebookSdk' : 'js/lib/facebook/facebook-js-sdk.min',
		'fabookPluginConnect' : 'js/lib/facebook/cdv-plugin-fb-connect.min',

		// directives
		'dateSelectorDirective' : 'js/app/directives/mobiscrollDirective.min',
		'scrollBarDirective' : 'js/app/directives/scrollBarDirective',

		// services
		'twitterService' : 'js/app/services/twitterService',
		'facebookService' : 'js/app/services/facebookService.min',
		'constantsService' : 'js/app/services/constantsService',
		'navigationService' : 'js/app/services/navigationService.min',
		'localStorageService' : 'js/app/services/localStgeService',
		'dataServices' : 'js/app/services/dataServices.min',
		'cordovaServices' : 'js/app/services/cordovaServices',

		// controllers
		'homeController' : 'js/app/controllers/HomeController.min',
		'textViewerController' : 'js/app/controllers/TextViewerController',
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
		},
		'jsOAuth' : {
			exports : 'OAuth'
		}
	}
});

require([ 'guiaEncuentroApp', 'localStorageService', 'navigationService',
		'dateSelectorDirective', 'homeController', 'constantsService', 'cordovaServices' ],
		function(guiaEncuentroApp) {
			angular.bootstrap(document, [ 'guiaEncuentroApp' ]);
			guiaEncuentroApp.initialize();
		});