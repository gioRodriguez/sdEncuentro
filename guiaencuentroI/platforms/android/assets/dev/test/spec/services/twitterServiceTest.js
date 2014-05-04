/**
 * Twitter service tests
 */
define(
		[ 'guiaEncuentroApp', 'twitterService' ],
		function(guiaEncuentroApp) {
			describe(
					'twitterService test',
					function() {
						'use strict';

						beforeEach(module('guiaEncuentroApp'));

						var injector;
						var OAuthObject;
						var localStorageService;
						var CodebirdObject;
						var cordovaServices;
						var browser;
						beforeEach(function() {
							// mock local storage service
							module(function($provide) {
								$provide.value('localStorageService', localStorageService);
								$provide.value('cordovaServices', cordovaServices);
							});

							// mock OAuth
							OAuthObject = jasmine.createSpyObj('OAuth', [ 'get', 'post', 'setAccessToken' ]);
							OAuthObject.get = function() {
							};
							OAuthObject.post = function() {
							};
							OAuthObject.setAccessToken = function() {								
							};
							window.OAuth = function() {
								return OAuthObject;
							};
							
							CodebirdObject = jasmine.createSpyObj('Codebird', 
									[
									 'setConsumerKey', 
									 '__call',
									 'setToken'
									 ]
							);
							CodebirdObject.__call = function() {								
							};
							CodebirdObject.setConsumerKey = function() {								
							};
							CodebirdObject.setToken = function() {								
							};
							window.Codebird = function() {
								return CodebirdObject;
							};
							
							localStorageService = jasmine.createSpyObj('localStorageService', [ 'get', 'set' ]);
							localStorageService.get = function() {
							};
							localStorageService.set = function() {
							};
							
							browser = jasmine.createSpyObj('browser', ['addEventListener', 'close']);
							browser.addEventListener = function() {								
							};
							browser.close = function() {								
							};
							
							cordovaServices = jasmine.createSpyObj('cordovaServices', ['openBrowser']);
							cordovaServices.openBrowser = function() {							
							};

							inject(function($injector) {
								injector = $injector;
							});
						});

						it(
								'must publish when has a previous login active',
								function() {
									// arrange
									spyOn(localStorageService, 'get').andReturn({
										accessTokenKey : 'accessTokenKey',
										accessTokenSecret : 'accessTokenSecret'
									});

									spyOn(OAuthObject, 'get').andCallFake(
											function(url, susscessCallback, errorCallback) {
												susscessCallback();
											});
									spyOn(OAuthObject, 'post').andCallFake(
											function(url, message, susscessCallback, errorCallback) {
												susscessCallback();
											});
									var twitterService = injector.get('twitterService');

									// act
									var publishPromise = twitterService.publish('hello twitter');

									// assert
									expect(publishPromise.state()).toBe('resolved');
									expect(localStorageService.get).toHaveBeenCalledWith(
											'accessData');
									// verify credentials validation
									expect(OAuthObject.get).toHaveBeenCalledWith(
											'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
											jasmine.any(Function), 
											jasmine.any(Function)
									);
									// publish validation
									expect(OAuthObject.post).toHaveBeenCalledWith(
											'https://api.twitter.com/1.1/statuses/update.json', 
											{
												status : 'hello twitter',
												'trim_user' : 'true'
											}, 
											jasmine.any(Function), 
											jasmine.any(Function)
									);
						});

						it('must ask login and publish if the login was successful',
								function() {
							// arrange
							spyOn(localStorageService, 'get').andReturn({});
							spyOn(localStorageService, 'set');
														
							spyOn(OAuthObject, 'get').andCallFake(
									function(url, susscessCallback, errorCallback) {
										if(url.indexOf('oauth_verifierMock') > 0){
											susscessCallback({text:'url?oauth_token=oauth_tokenMock&oauth_token_secret=oauth_token_secretMock'});
										} else {
											errorCallback();
										}
							});
							spyOn(OAuthObject, 'post').andCallFake(
									function(url, message, susscessCallback, errorCallback) {
										susscessCallback();
									});
							spyOn(OAuthObject, 'setAccessToken');
							
							spyOn(CodebirdObject, '__call').andCallFake(
									function(key, options, callback) {
										if(key == 'oauth_authorize'){
											callback('appAuthZAppURL');
										} else {
											callback(
													{
														httpstatus : 200,
														oauth_token : 'oauth_token',
														oauth_token_secret : 'oauth_token_secret'
													}
											);
										}
							});
							spyOn(CodebirdObject, 'setToken');
														
							spyOn(browser, 'addEventListener').andCallFake(
									function(event, listener) {	
										listener({url: 'https://www.facebook.com/guiatwittertest3?verifier=verifierMock&oauth_verifier=oauth_verifierMock&oauth_token=oauth_tokenMock'});
							});
							spyOn(browser, 'close');
							
							spyOn(cordovaServices, 'openBrowser').andReturn(browser);
							
							var twitterService = injector.get('twitterService');

							// act
							var publishPromise = twitterService.publish('hello twitter');

							// assert
							expect(publishPromise.state()).toBe('resolved');
							expect(OAuthObject.get).toHaveBeenCalledWith(
									'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
									jasmine.any(Function), 
									jasmine.any(Function)
							);
							expect(CodebirdObject.__call).toHaveBeenCalledWith(
									'oauth_requestToken',
									{
										oauth_callback : 'https://www.facebook.com/guiatwittertest3'
									},
									jasmine.any(Function)
							);
							expect(CodebirdObject.setToken).toHaveBeenCalledWith(
									'oauth_token',
									'oauth_token_secret'
							);
							expect(cordovaServices.openBrowser).toHaveBeenCalledWith('appAuthZAppURL');
							expect(OAuthObject.get).toHaveBeenCalledWith(
									'https://api.twitter.com/oauth/access_token?oauth_verifier=oauth_verifierMock&oauth_token=oauth_tokenMock',
									jasmine.any(Function),
									jasmine.any(Function)
							);
							expect(localStorageService.set).toHaveBeenCalledWith(
									'accessData',
									{
										accessTokenKey : 'oauth_tokenMock',
										accessTokenSecret : 'oauth_token_secretMock'
									}
							);
							expect(OAuthObject.setAccessToken).toHaveBeenCalledWith(
									['oauth_tokenMock', 'oauth_token_secretMock']
							);
							expect(browser.close).toHaveBeenCalled();
							// publish validation
							expect(OAuthObject.post).toHaveBeenCalledWith(
									'https://api.twitter.com/1.1/statuses/update.json', 
									{
										status : 'hello twitter',
										'trim_user' : 'true'
									}, 
									jasmine.any(Function), 
									jasmine.any(Function)
							);
					  });

						it('must reject the the publish if the login was unsuccessful',
								function() {
									// arrange
									var twitterService = injector.get('twitterService');

									// act
									var publishPromise = twitterService.publish('hello twitter');

									// assert
									// expect(publishPromise.state()).toBe('rejected');
								});
					});
		});