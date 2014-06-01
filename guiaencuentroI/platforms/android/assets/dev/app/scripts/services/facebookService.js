/**
 * facebook api services
 */
(function() {
	var mServiceStatus = {};

	var facebookService = function(cordovaServices) {
		var facebookServiceFactory = {};

		/**
		 * Valid if has an active account
		 */
		facebookServiceFactory.hasActiveAccount =  function() {
			var isNetworkAvaiablePromise = cordovaServices.isNetworkAvailableAsync();
			return isNetworkAvaiablePromise.then(function() {
				init();						
				return validUserPreviousLogin();
			}, function() {
				return exceptions.notNetworkException();
			});
		};
		
		/**
		 * Publish a text to facebook
		 */
		facebookServiceFactory.publish = function(text) {
			var isNetworkAvaiablePromise = cordovaServices.isNetworkAvailableAsync();
			return isNetworkAvaiablePromise.then(function() {
				return publish(text);
			}, function() {
				return exceptions.notNetworkException();
			});
		};
		
		function publish(text) {
			init();
			
			var publishDeferred = $.Deferred();
			validUserPreviousLogin().then(function() {
				// the user has a previous login active then
				publishToFacebook(text, function() {
					publishDeferred.resolve();
				});
			}, function() {
				// called if the user has not a previous login or was disabled then
				requestUserDoLogin().then(function() {
					// if the user did a successful login then
					publishToFacebook(text, function() {
						publishDeferred.resolve();
					});
				}, function() {
					// if the user fail then
					publishDeferred.reject();
				});
			});

			// I promises you the publish will be done ;) or maybe not :P 
			return publishDeferred.promise();
		}

		function requestUserDoLogin() {
			var userLogin = $.Deferred();
			var permisses = {
				scope : 'email'
			};
			FB.login(function(loginResponse) {
				if (loginResponse.authResponse) {
					// was a successful login
					userLogin.resolve();
				} else {
					// login failed :(
					userLogin.reject();
				}
			}, permisses);

			return userLogin.promise();
		}

		/**
		 * publication = {
		 * 	message : text to post in the message
		 * 	link : link to the item
		 * 	picture : image URL to show
		 * 	name : name to show
		 *  caption : caption to show
		 * }
		 */
		function publishToFacebook(publication, publishCallback) {
			FB.api('/me/feed', 'post', {
				message : publication.message,
				link : publication.link,
				picture : publication.picture,
				name : publication.name,
				caption : publication.caption			
			}, function(response) {
				publishCallback(response);
			});
		}

		function validUserPreviousLogin() {
			var hasPreviousLoginActive = $.Deferred();
			FB.getLoginStatus(function(checkStatus) {
				if (checkStatus.authResponse) {
					hasPreviousLoginActive.resolve();
				} else {
					hasPreviousLoginActive.reject();
				}
			});

			return hasPreviousLoginActive.promise();
		}

		/**
		 * Do facebook logout
		 */
		facebookServiceFactory.logout = function() {
			var logoutDeferred = $.Deferred();
			FB.logout(function(response) {
				logoutDeferred.resolve();
			});
			return logoutDeferred.promise();
		};
		
		function init() {
			FB.init({
				appId : '284021708287063',
				nativeInterface : CDV.FB,
				useCachedDialogs : false
			});
		}

		return facebookServiceFactory;
	}
	
	angular.module('guiaEncuentroApp').factory('facebookService', [ 'cordovaServices', facebookService ]);
})();