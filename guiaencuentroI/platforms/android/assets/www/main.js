/**
 * Require configuration
 */
"use strict";

require.config({
	paths : {
		'guiaEncuentroApp' : 'app/guiaEncuentroApp',
		'jquery' : 'app/lib/jquery/jquery-1.10.2.min',
		'zepto' : 'app/lib/zepto/zepto',
		'mobiscrollZepto' : 'app/lib/mobiscroll/js/mobiscroll.zepto',
		'mobiscrollCore' : 'app/lib/mobiscroll/js/mobiscroll.core',
		'mobiscrollScroller' : 'app/lib/mobiscroll/js/mobiscroll.scroller',
		'mobiscrollDate' : 'app/lib/mobiscroll/js/mobiscroll.datetime',
		'mobiscrollEs' : 'app/lib/mobiscroll/js/i18n/mobiscroll.i18n.es',
		'date-es' : 'app/lib/date/date-es-MX',

		// twitter
		'jsOAuth' : 'app/lib/jsOAuth/jsOAuth-1.3.6.min',
		'codebird' : 'app/lib/codebird/codebird',

		// facebook
		'facebookSdk' : 'app/lib/facebook/facebook-js-sdk.min',
		'fabookPluginConnect' : 'app/lib/facebook/cdv-plugin-fb-connect.min',

		// directives
		'dateSelectorDirective' : 'app/directives/mobiscrollDirective',
		'scrollBarDirective' : 'app/directives/scrollBarDirective',

		// services
		'twitterService' : 'app/services/twitterService',
		'facebookService' : 'app/services/facebookService',
		'constantsService' : 'app/services/constantsService',
		'navigationService' : 'app/services/navigationService',
		'localStorageService' : 'app/services/localStgeService',
		'dataServices' : 'app/services/dataServices',
		'cordovaServices' : 'app/services/cordovaServices',

		// controllers
		'homeController' : 'app/controllers/HomeController',
		'textViewerController' : 'app/controllers/TextViewerController',
		'settingsController' : 'app/controllers/SettingsController'
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