/**
 * Require configuration
 */
"use strict";

var tests = [];
for ( var file in window.__karma__.files) {
	if (window.__karma__.files.hasOwnProperty(file)) {
		if (/Test\.js$/.test(file)) {
			tests.push(file);
		}
	}
}

require
		.config({
			baseUrl : '/base/app',
			paths : {
				'mobiscrollZepto' : 'bower_components/mobiscroll/js/mobiscroll.zepto',
				'mobiscrollCore' : 'bower_components/mobiscroll/js/mobiscroll.core',
				'mobiscrollScroller' : 'bower_components/mobiscroll/js/mobiscroll.scroller',
				'mobiscrollDate' : 'bower_components/mobiscroll/js/mobiscroll.datetime',
				'mobiscrollEs' : 'bower_components/mobiscroll/js/i18n/mobiscroll.i18n.es',
				'date-es' : 'bower_components/datejs/build/date-es-MX',

				// twitter
				'jsOAuth' : 'bower_components/jsOAuth/dist/jsOAuth-1.3.6',
				'codebird' : 'bower_components/codebird/codebird',
				'sha1' : 'bower_components/codebird/sha1',

				// facebook
				'facebookSdk' : 'scripts/lib/facebook/facebook-js-sdk',
				'fabookPluginConnect' : 'scripts/lib/facebook/cdv-plugin-fb-connect',

				'guiaEncuentroApp' : 'scripts/guiaEncuentroApp',
				'app' : 'scripts/app',

				// directives
				'dateSelectorDirective' : 'scripts/directives/mobiscrollDirective',
				'scrollBarDirective' : 'scripts/directives/scrollBarDirective',

				// services
				'twitterService' : 'scripts/services/twitterService',
				'facebookService' : 'scripts/services/facebookService',
				'constantsService' : 'scripts/services/constantsService',
				'navigationService' : 'scripts/services/navigationService',
				'localStgeService' : 'scripts/services/localStgeService',
				'dataServices' : 'scripts/services/dataServices',
				'cordovaServices' : 'scripts/services/cordovaServices',

				// controllers
				'homeController' : 'scripts/controllers/HomeController',
				'homeController3' : 'scripts/controllers/HomeController3',
				'textViewerController' : 'scripts/controllers/TextViewerController',
				'settingsController' : 'scripts/controllers/SettingsController'
			},
			shim : {
				'mobiscrollDate' : {
					deps : [ 'mobiscrollScroller', 'mobiscrollEs' ]
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
				'fabookPluginConnect' : {
					exports : 'CDV'
				},
				'facebookSdk' : {
					deps : [ 'fabookPluginConnect' ],
					exports : 'FB'
				},
				'jsOAuth' : {
					exports : 'OAuth'
				},
				'codebird' : {
					deps : [ 'sha1' ]
				}
			},

			// ask Require.js to load these files (all our tests)
			deps : tests,

			// start test run, once Require.js is done
			callback : window.__karma__.start
		});

require([ 'guiaEncuentroApp', 'localStgeService', 'navigationService',
		'dateSelectorDirective', 'homeController', 'constantsService',
		'cordovaServices' ], function(guiaEncuentroApp) {
	guiaEncuentroApp.initialize();
});