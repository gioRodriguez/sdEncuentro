/**
 * twitter service
 */

define(
		[ 'guiaEncuentroApp', 'codebird', 'jsOAuth' ],
		function(guiaEncuentroApp) {
			var twitterService = function(
					cordovaServices,
					$translate,
					localStorageService) {
				var twitterServiceFactory = {};
				var oauthOptions = {
					consumerKey : 'xnBHedrb9KkhgokvnZMmg',
					consumerSecret : '6sDkd3ZEP1CRInrQunNfnqWfGKB4CKBsgmnEDPxWBBA',
					callbackUrl : 'https://www.facebook.com/guiatwittertest3'
				};
				var oauth = OAuth(oauthOptions);
				var twitText = '';
				
				/**
				 * Publish to twitter
				 */
				twitterServiceFactory.publish = function(text) {
					var publishDeferred = $.Deferred();
					
					twitText = text;
					validUserPreviousLogin().then(function() {
						publishTweet(text, function() {
							publishDeferred.resolve();
						});
					}, function() {
						askUserLogin().then(function() {
							publishTweet(text, function() {
								publishDeferred.resolve();
							});
						});
					});
					
					return publishDeferred.promise();
				}
				
				function validUserPreviousLogin() {
					console.log('verifyCredentials called 1');
					var hasPreviousLoginActive = $.Deferred(); 
					var storedAccessData = localStorageService.get('accessData');
					if (storedAccessData) {
						oauthOptions.accessTokenKey = storedAccessData.accessTokenKey;
						oauthOptions.accessTokenSecret = storedAccessData.accessTokenSecret;
						oauth = OAuth(oauthOptions);
						oauth
								.get(
										'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
										function() {
											console.log('verifyCredentials resolved');
											hasPreviousLoginActive.resolve();
										}, function() {
											oauthOptions.accessTokenKey = '';
											oauthOptions.accessTokenSecret = '';
											localStorageService.set('accessData', null);
											console.log('verifyCredentials rejected 2');
											hasPreviousLoginActive.reject();
										});
					} else {
						console.log('verifyCredentials rejected 2');
						hasPreviousLoginActive.reject()
					}

					return hasPreviousLoginActive.promise();
				}
				
				function publishTweet(text, successCallback) {
					console.log('publishTweet called');
					oauth.post('https://api.twitter.com/1.1/statuses/update.json', {
						'status' : text, // jsOAuth encodes for us
						'trim_user' : 'true'
					}, function() {
						successCallback();
						console.log('publishTweet resolved');
					}, function() {
						publishFailure();
						console.log('publishTweet rejected');
					});
				}
				
				function askUserLogin() {
					var userLoginDeferred = $.Deferred();
					
					getAppAuthorizedURL().then(function(appAuthorizedURL) {						
						openBrowserToLogin(appAuthorizedURL).then(function() {
							userLoginDeferred.resolve();
						}, function() {
							userLoginDeferred.reject();
						});
					});
					
					return userLoginDeferred.promise();
				}
				
				function getAppAuthorizedURL() {
					var getAppAuthorizedURLDeferred = $.Deferred();
					
					getAppToken().then(function(appToken) {
						getAppAuthZURL(appToken).then(function(appAuthorizedURL) {
							getAppAuthorizedURLDeferred.resolve(appAuthorizedURL);
						}, function() {
							getAppAuthorizedURLDeferred.reject();
						});
					});
					
					return getAppAuthorizedURLDeferred.promise();
				}
				
				function getAppToken(){
					var appTokenDeferred = $.Deferred();
					var cb = new Codebird();
					cb.setConsumerKey(
							oauthOptions.consumerKey,
							oauthOptions.consumerSecret
					);
					cb.__call(
							'oauth_requestToken', 
							{
								oauth_callback : oauthOptions.callbackUrl
							}, 
							function(reply) {
								if (reply.httpstatus == 200) {
									console.log('getOAuthAppToken resolved 5');
									//cb.setToken(reply.oauth_token, reply.oauth_token_secret);
									appTokenDeferred.resolve(
											{
												oauth_token: reply.oauth_token,
												oauth_token_secret : reply.oauth_token_secret
											}
									);
								} else {
									console.log('getOAuthAppToken rejected');
									appTokenDeferred.reject();
								}
					});

					return appTokenDeferred.promise();
				}
				
				function getAppAuthZURL(appToken) {
					console.log('getOAuthUserToken called 6');						
					var appAuthZURLDeferred = $.Deferred();
					var cb = new Codebird();
					cb.setConsumerKey(
							oauthOptions.consumerKey,
							oauthOptions.consumerSecret
					);
					cb.setToken(appToken.oauth_token, appToken.oauth_token_secret);
					
					cb.__call("oauth_authorize", {}, function(reply) {
						// if the call fails the reply contains a httpstatus if was
						// successful is the aouth url
						if (reply.httpstatus) {
							console.log('getOAuthUserToken reject');
							appAuthZURLDeferred.reject();
						} else {
							console.log('getOAuthUserToken resolve 7 reply: ' + reply);
							appAuthZURLDeferred.resolve(reply);
						}
					});

					return appAuthZURLDeferred.promise();
				}
				
				function openBrowserToLogin(appAuthorizedURL) {
					console.log('manageBrowser called 8 url: ' + appAuthorizedURL);
					var manageBrowserProm = $.Deferred();
					var browser = cordovaServices.openBrowser(appAuthorizedURL);
					browser
							.addEventListener(
									'loadstart',
									function(event) {
										console.log('page loaded: ' + event.url);
										var currentUrl = event.url;

										// user cancels the request
										if (event.url
												.indexOf('https://www.facebook.com/guiatwittertest3/?denied') >= 0) {
											console.log('manageBrowser rejected');
											browser.close();
											manageBrowserProm.rejected();
										}

										if (event.url === oauthOptions.callbackUrl) {
											console.log('manageBrowser rejected');
											browser.close();
											manageBrowserProm.rejected();
										}

										if (event.url
												.indexOf('https://www.facebook.com/guiatwittertest3?') >= 0) {
											console.log('verifier ' + event.url);
											var verifier = getQueryVariable(event.url,
													'oauth_verifier');
											var oauth_token = getQueryVariable(event.url,
													'oauth_token');

											oauth.get(
													'https://api.twitter.com/oauth/access_token?oauth_verifier='
															+ verifier + '&oauth_token=' + oauth_token,
													function(data) {
														console.log('data.text: ' + data.text);
														var oauth_token = getQueryVariable(data.text,
																'oauth_token');
														var oauth_token_secret = getQueryVariable(
																data.text, 'oauth_token_secret');
														oauth.setAccessToken([
																oauth_token,
																oauth_token_secret ]);

														// Save access token/key in localStorage
														var accessData = {};
														accessData.accessTokenKey = oauth_token;
														accessData.accessTokenSecret = oauth_token_secret;
														localStorageService.set('accessData', accessData);
														console.log('manageBrowser resolve');
														manageBrowserProm.resolve();
														browser.close();
													}, function(data) {
														console.log('manageBrowser rejected');
														manageBrowserProm.rejected();
													});
										}
									});

					return manageBrowserProm.promise();
				}

				/*function loginAndPublish() {
					return login().then(publishTweet);
				}*/

				/*function login() {
					console.log('loginTwitter called 3');
					return getOAuthAppToken().then(getOAuthUserToken).then(manageBrowser);
				}*/

				/*function getOAuthAppToken() {
					console.log('getOAuthAppToken called 4');
					var getOAuthAppToken = $.Deferred();
					var cb = new Codebird;
					cb.setConsumerKey(oauthOptions.consumerKey,
							oauthOptions.consumerSecret);
					cb.__call("oauth_requestToken", {
						oauth_callback : oauthOptions.callbackUrl
					}, function(reply) {
						if (reply.httpstatus == 200) {
							console.log('getOAuthAppToken resolved 5');
							cb.setToken(reply.oauth_token, reply.oauth_token_secret);
							getOAuthAppToken.resolve(cb);
						} else {
							console.log('getOAuthAppToken rejected');
							getOAuthAppToken.reject();
						}
					});

					return getOAuthAppToken.promise();
				}*/

				/*function getOAuthUserToken(cb) {
					console.log('getOAuthUserToken called 6');
					var getOAuthUserTokenProm = $.Deferred();
					cb.__call("oauth_authorize", {}, function(reply) {
						// if the call fails the reply contains a httpstatus if was
						// successful is the aouth url
						if (reply.httpstatus) {
							console.log('getOAuthUserToken reject');
							getOAuthUserTokenProm.reject();
						} else {
							console.log('getOAuthUserToken resolve 7 reply: ' + reply);
							getOAuthUserTokenProm.resolve(reply);
						}
					});

					return getOAuthUserTokenProm.promise();
				}*/

				/*function manageBrowser(url) {
					console.log('manageBrowser called 8 url: ' + url);
					var manageBrowserProm = $.Deferred();
					var browser = cordovaServices.openBrowser(url);
					browser
							.addEventListener(
									'loadstart',
									function(event) {
										console.log('page loaded: ' + event.url);
										var currentUrl = event.url;

										// user cancels the request
										if (currentUrl
												.indexOf('https://www.facebook.com/guiatwittertest3/?denied') >= 0) {
											console.log('manageBrowser rejected');
											browser.close();
											manageBrowserProm.rejected();
										}

										if (currentUrl === oauthOptions.callbackUrl) {
											console.log('manageBrowser rejected');
											browser.close();
											manageBrowserProm.rejected();
										}

										if (currentUrl
												.indexOf('https://www.facebook.com/guiatwittertest3?') >= 0) {
											console.log('verifier ' + currentUrl);
											var verifier = getQueryVariable(currentUrl,
													'oauth_verifier');
											var oauth_token = getQueryVariable(currentUrl,
													'oauth_token');

											oauth.get(
													'https://api.twitter.com/oauth/access_token?oauth_verifier='
															+ verifier + '&oauth_token=' + oauth_token,
													function(data) {
														console.log('data.text: ' + data.text);
														var oauth_token = getQueryVariable(data.text,
																'oauth_token');
														var oauth_token_secret = getQueryVariable(
																data.text, 'oauth_token_secret');
														oauth.setAccessToken([
																oauth_token,
																oauth_token_secret ]);

														// Save access token/key in localStorage
														var accessData = {};
														accessData.accessTokenKey = oauth_token;
														accessData.accessTokenSecret = oauth_token_secret;
														localStorageService.set('accessData', accessData);
														console.log('manageBrowser resolve');
														manageBrowserProm.resolve();
														browser.close();
													}, function(data) {
														console.log('manageBrowser rejected');
														manageBrowserProm.rejected();
													});
										}
									});

					return manageBrowserProm.promise();
				}	*/			

				function getQueryVariable(url, variable) {
					var query = url.substr(url.indexOf('?') + 1);
					var vars = query.split('&');
					for (var i = 0; i < vars.length; i++) {
						var pair = vars[i].split('=');
						if (decodeURIComponent(pair[0]) == variable) {
							return decodeURIComponent(pair[1]);
						}
					}
					console.log('getQueryVariable called: ' + variable)
					console.log('Query variable %s not found', variable);
				}

				function publishFailure() {
					cordovaServices.alert($translate('publishFail'),
							$translate('publishTitle'), $translate('publishOk'));
				}

				return twitterServiceFactory;
			};

			guiaEncuentroApp.factory('twitterService', [
					'cordovaServices',
					'$translate',
					'localStorageService',
					twitterService ]);
		});