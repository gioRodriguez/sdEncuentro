/**
 * 
 */
var exceptions = exceptions || {};
(function() {
	exceptions.notNetworkException = function() {
		return {
			name : 'NotNetworkException',
			message : 'not network available',
			isNetworkException : true
		};
	};
	
	exceptions.invalidAskedDateException = function() {
		return {
			name : 'InvalidAskedDateException',
			message : 'The date asked is not valid',
			isNetworkException : true
		};
	};
})();