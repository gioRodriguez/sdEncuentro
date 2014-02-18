/**
 * Require configuration
 */
"use strict";

require
		.config({
			paths : {
				'appBootstrap' : 'scripts/appBootstrap',
				'guiaEncuentroApp' : 'scripts/guiaEncuentroApp',
				'app' : 'scripts/app',
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
			}
		});

require([ 'guiaEncuentroApp', 'appBootstrap', 'homeController' ], function(
		guiaEncuentroApp) {
	angular.bootstrap(document, [ 'guiaEncuentroApp' ]);
	guiaEncuentroApp.initialize();
});