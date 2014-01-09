/**
 * Require configuration
 */
"use strict";

require.config({
	paths : {
		'sdEncuentro' : 'js/sdencuentro',
		'jquery' : 'js/lib/jquery/jquery-1.10.2.min'
	}
});

require([ 'sdEncuentro', 'js/app/services/navigation-service',
		'js/app/controllers/HomeController',
		'js/app/controllers/TextViewerController' ], function(sdEncuentro) {
	angular.bootstrap(document, [ 'SdEncuentro' ]);
	sdEncuentro.initialize();
});