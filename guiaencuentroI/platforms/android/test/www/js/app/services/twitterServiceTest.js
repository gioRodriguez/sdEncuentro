/**
 * 
 */
define([ 'Squire' ], function(Squire) {
	var twitterServiceTest = function() {
		var twitterServiceTestFac = {};
		var mockLocalStorage = {
			get : function() {
				return {
					accessTokenKey : 'accessTokenKey',
					accessTokenSecret : 'accessTokenSecret'
				};
			}
		};
		var publishSuccess = false;
		var mockZepto = {
			Deferred : function() {
				return {
					promise : function() {
						return {
							then : function(success, failure) {
							}
						}
					},
					resolve : function() {
						publishSuccess = true;
					}
				}
			}
		};
		var mockJsOAuth = function() {
			Window.prototype.OAuth = function() {
				return {
					get : function(url, success) {
						success();
					}
				};
			};
		};

		twitterServiceTestFac.run = function() {
			var injector = new Squire();
			module('twitterServiceTest', {
				setup : function() {
					injector.mock('codebird', {});
					injector.mock('localStorageService', mockLocalStorage);
					injector.mock('zepto', mockZepto);
					injector.mock('jsOAuth', mockJsOAuth);
				},
				teardown : function() {
					injector = new Squire();
				}
			});

			injector.require([ 'twitterService' ], function(TwitterService) {
				test('publishWithValidStoredCredentials', function() {
					// arrange
					var twitterService = new TwitterService();

					// act
					twitterService.publish('hola mundo');

					// assert
					ok(publishSuccess);
				});
			});
		};

		return twitterServiceTestFac;
	};

	return twitterServiceTest;
});