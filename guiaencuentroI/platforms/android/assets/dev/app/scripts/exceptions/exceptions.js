/**
 * 
 */
define('exceptions', function() {
	var exceptionsFactory = {};

	exceptionsFactory.notNetworkException = function() {
		return {
			name : 'NotNetworkException',
			message : 'not network available',
			isNetworkException : true
		};
	};

	return exceptionsFactory;
});