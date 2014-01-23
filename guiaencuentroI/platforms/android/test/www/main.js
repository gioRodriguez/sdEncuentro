/**
 * 
 */
require.config({
	paths : {
		'QUnit' : 'qunit-1.13.0',
		'Squire' : 'Squire',
		'twitterService' : '../../assets/www/js/app/services/twitterService'
	},
	shim : {
		'QUnit' : {
			exports : 'QUnit',
			init : function() {
				QUnit.config.autoload = false;
				QUnit.config.autostart = false;
			}
		},
		'Squire' : {
			exports : 'Squire'
		}
	}
});

require([ 'QUnit', 'js/app/services/twitterServiceTest' ], function(QUnit,
		TwitterServiceTest) {
	var twitterServiceTest = new TwitterServiceTest();
	twitterServiceTest.run();

	QUnit.load();
	QUnit.start();
});