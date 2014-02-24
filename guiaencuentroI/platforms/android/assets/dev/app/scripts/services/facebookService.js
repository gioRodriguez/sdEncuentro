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

			var publish = $.Deferred();
			validUserPreviousLogin().then(function() {
				// the user has a previous login active then
				publishToFacebook(text, function() {
					publish.resolve();
				});
			}, function() {
				// called if the user has not a previous login or was disabled then
				requestUserDoLogin().then(function() {
					// if the user did a successful login then
					publishToFacebook(text, function() {
						publish.resolve();
					});
				}, function() {
					// if the user fail then
					publish.reject();
				});
			});

			// I promises you the publish will be done ;) or maybe not :P 
			return publish.promise();
		};

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

		function publishToFacebook(text, publishCallback) {
			FB.api('/me/feed', 'post', {
				message : text
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

		facebookServiceFactory.logout = function() {
			FB.logout(function(response) {
				window.location.reload();
			});
		};

		return facebookServiceFactory;
	}

	guiaEncuentroApp.factory('facebookService', [ facebookService ]);
});