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
			var hasActiveAccountDeferred = $.Deferred();
			
			cordovaServices.isNetworkAvailableAsync().then(function() {
				init();						
				validUserPreviousLogin().then(function() {
				  hasActiveAccountDeferred.resolve();
        }, function() {
          hasActiveAccountDeferred.reject();
        });
			}, function() {
			  hasActiveAccountDeferred.reject(exceptions.notNetworkException());
			});
			
			return hasActiveAccountDeferred.promise();
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

			window.facebookConnectPlugin.login(['email'], function(){
			  // was a successful login
        userLogin.resolve();
			}, function(){
			  // login failed :(
        userLogin.reject();
			});

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
		  window.facebookConnectPlugin.showDialog({ 
		    method: "feed",
		    link : publication.link,
	      picture : publication.picture,
	      name : publication.name,
	      caption : publication.caption
		    }, 
		    publishCallback, 
		    publishCallback
		  );
		}

		function validUserPreviousLogin() {
			var hasPreviousLoginActive = $.Deferred();
			window.facebookConnectPlugin.getLoginStatus(function(checkStatus){
			  console.log(JSON.stringify(checkStatus));
			  if (checkStatus.authResponse &&
			       checkStatus.authResponse.accessToken) {
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
			window.facebookConnectPlugin.logout(function(response) {
				logoutDeferred.resolve();
			}, function(err){
			  logoutDeferred.reject();
			});
			return logoutDeferred.promise();
		};
		
		function init() {
		}

		return facebookServiceFactory;
	}
	
	angular.module('guiaEncuentroApp').factory('facebookService', [ 'cordovaServices', facebookService ]);
})();