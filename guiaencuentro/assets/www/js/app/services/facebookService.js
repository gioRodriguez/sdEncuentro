/**
 * facebook api services
 */
define([ 'facebookSdk' ], function() {
	FB.init({
		appId : '284021708287063',
		nativeInterface : CDV.FB,
		useCachedDialogs : false
		});

	var facebookService = function() {
		var facebookServiceFactory = {};
		
		facebookServiceFactory.publish = function(text) {
			var deferred = $.Deferred();
			FB.api('/me/feed', 'post', { message: text }, function(response) {
				deferred.resolve(response)
			})
			return deferred.promise();				
		};

		facebookServiceFactory.logout = function() {
			logout();				
		};
				
		return facebookServiceFactory;
	}
			
	return facebookService;
});