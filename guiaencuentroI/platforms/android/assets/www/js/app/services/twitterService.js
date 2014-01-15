/**
 * twitter service
 */

define([ 'codebird' ], function(Codebird) {
	var twitterService = function() {
		var twitterServiceFactory = {};
		var cb = new Codebird;
		cb.setConsumerKey("xnBHedrb9KkhgokvnZMmg",
				"6sDkd3ZEP1CRInrQunNfnqWfGKB4CKBsgmnEDPxWBBA");
		var requestParams = null;
		twitterServiceFactory.publish = function() {
			cb.__call("oauth_requestToken", {
				oauth_callback : "oob"
			}, function(reply) {
				// stores it
				cb.setToken(reply.oauth_token, reply.oauth_token_secret);

				// gets the authorize screen URL
				cb.__call("oauth_authorize", {}, function(auth_url) {
					window.codebird_auth = window.open(auth_url, '_blank', 'location=false');
				});
			});
		};

		function twitterFailure() {
			console.log('faillllllllll :(');
		}

		return twitterServiceFactory;
	};

	return twitterService;
});