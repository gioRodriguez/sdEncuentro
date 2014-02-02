/**
 * facebook api services
 */
define([ 'guiaEncuentroApp', 'facebookSdk' ], function(guiaEncuentroApp) {
	var mServiceStatus = {};		
	
	var facebookService = function() {
		var facebookServiceFactory = {};
		
		facebookServiceFactory.publish = function(text) {			
			FB.init({
				appId : '284021708287063',
				nativeInterface : CDV.FB,
				useCachedDialogs : false
			});
			
			
			var facebookLoginPromise = checkFacebookLogin();
			var postDeferred = $.Deferred();
			facebookLoginPromise.then(function(serviceStatus) {
				if (serviceStatus.authResponse) {
					FB.api('/me/feed', 'post', {
						message : text
					}, function(response) {
						postDeferred.resolve(response)
					})
				} else {
					postDeferred.resolve('falla');
				}
			});

			return postDeferred.promise();
		};

		function checkFacebookLogin() {
			var chechStatusDeferred = $.Deferred();
			FB.getLoginStatus(function(checkStatus) {
				chechStatusDeferred.resolve(checkStatus);
			});

			var loginDeferred = $.Deferred();
			chechStatusDeferred.promise().then(function(checkStatus) {
				if (checkStatus.authResponse) {
					loginDeferred.resolve(checkStatus);
				} else {
					FB.login(function(loginResponse) {
						loginDeferred.resolve(loginResponse);
					}, {
						scope : 'email'
					});
				}
			});

			return loginDeferred.promise();
		}

		facebookServiceFactory.logout = function() {
			FB.logout(function(response) {
			    window.location.reload();
			  });
		};

		return facebookServiceFactory;
	}

	guiaEncuentroApp.factory('facebookService', [ facebookService ]);
});