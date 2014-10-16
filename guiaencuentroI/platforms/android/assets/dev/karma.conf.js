// Karma configuration
// Generated on Tue Feb 04 2014 13:45:21 GMT-0600 (Central Standard Time (Mexico))

module.exports = function(config) {
	config.set({

		// base path, that will be used to resolve files and exclude
		basePath : '',

		// frameworks to use
		frameworks : [ 'jasmine'],

		// list of files / patterns to load in the browser
		files : [ 'app/bower_components/angular/angular.js',
				'app/bower_components/angular-mocks/angular-mocks.js',
				'app/bower_components/angular-animate/angular-animate.js',
				'app/bower_components/angular-route/angular-route.js',
				'app/bower_components/angular-sanitize/angular-sanitize.js',
				'app/bower_components/angular-touch/angular-touch.js',
				'app/bower_components/angular-mobile-nav/mobile-nav.js',
				'app/bower_components/angular-translate/angular-translate.js',
				'app/bower_components/angular-spinner/angular-spinner.js',

				'app/bower_components/zeptojs/src/zepto.js',
				'app/bower_components/zeptojs/src/form.js',
				'app/bower_components/zeptojs/src/ie.js',
				'app/bower_components/zeptojs/src/deferred.js',
				'app/bower_components/zeptojs/src/callbacks.js',
				'app/bower_components/zeptojs/src/event.js',
				'app/bower_components/zeptojs/src/ajax.js',
				
				'app/bower_components/modernizr/modernizr.js',
				
				'app/bower_components/datejs/build/date-es-MX.js',
				
				'app/bower_components/fastclick/lib/fastclick.js',
				
				'app/scripts/lib/facebook/facebook-js-sdk.js',
				'app/scripts/lib/facebook/cdv-plugin-fb-connect.js',
				
				'test/utils/*.js',
				
				'app/scripts/guiaEncuentroApp.js',
				'app/scripts/appBootstrap.js',
				'app/scripts/**/*.js', 
				'test/spec/**/*.js'
				],

		// list of files to exclude
		exclude : [],

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters : [ 'progress' ],

		// web server port
		port : 9876,

		// enable / disable colors in the output (reporters and logs)
		colors : true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR ||
		// config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel : config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file
		// changes
		autoWatch : false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera (has to be installed with `npm install karma-opera-launcher`)
		// - Safari (only Mac; has to be installed with `npm install
		// karma-safari-launcher`)
		// - PhantomJS
		// - IE (only Windows; has to be installed with `npm install
		// karma-ie-launcher`)
		browsers : [ 'PhantomJS' ],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout : 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun : false
	});
};
