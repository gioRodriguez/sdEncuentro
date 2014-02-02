/**
 * twitter service
 */

define(['guiaEncuentroApp', 'codebird', 'jsOAuth'], function(guiaEncuentroApp, Codebird) {
	var twitterService = function(cordovaServices, $translate, localStorageService) {
		var twitterServiceFactory = {};		
		var oauthOptions = { 
	            consumerKey: 'xnBHedrb9KkhgokvnZMmg',
	            consumerSecret: '6sDkd3ZEP1CRInrQunNfnqWfGKB4CKBsgmnEDPxWBBA',
	            callbackUrl: 'https://www.facebook.com/guiatwittertest3' };
		var oauth = OAuth(oauthOptions);
		var twitText = '';
		twitterServiceFactory.publish = function(text) {	
			twitText = text;
			verifyCredentials().then(publishTweet, loginAndPublish);		
		}
		
		function loginAndPublish(){
			return login().then(publishTweet);
		}
		
		function login() {		
			console.log('loginTwitter called 3');					
			return getOAuthAppToken().then(getOAuthUserToken).then(manageBrowser);
		}
		
		function getOAuthAppToken(){
			console.log('getOAuthAppToken called 4');
			var getOAuthAppToken = new $.Deferred();
			var cb = new Codebird;
			cb.setConsumerKey(oauthOptions.consumerKey, oauthOptions.consumerSecret);
			cb.__call("oauth_requestToken", { oauth_callback : oauthOptions.callbackUrl }, function(reply) {
				if(reply.httpstatus == 200){					
					console.log('getOAuthAppToken resolved 5');
					cb.setToken(reply.oauth_token, reply.oauth_token_secret);
					getOAuthAppToken.resolve(cb);
				} else {
					console.log('getOAuthAppToken rejected');
					getOAuthAppToken.reject();
				}
			});
			
			return getOAuthAppToken.promise();
		}
		
		function getOAuthUserToken(cb){
			console.log('getOAuthUserToken called 6');
			var getOAuthUserTokenProm = new $.Deferred();
			cb.__call("oauth_authorize", {}, function(reply) {
				// if the call fails the reply contains a httpstatus if was successful is the aouth url
				if(reply.httpstatus){
					console.log('getOAuthUserToken reject');
					getOAuthUserTokenProm.reject();
				} else {
					console.log('getOAuthUserToken resolve 7 reply: ' + reply);
					getOAuthUserTokenProm.resolve(reply);
				}										
			});
			
			return getOAuthUserTokenProm.promise();
		}
		
		function manageBrowser(url) {
			console.log('manageBrowser called 8 url: ' + url);
			var manageBrowserProm = new $.Deferred();
			var browser = cordovaServices.openBrowser(url);
			browser.addEventListener('loadstart', function(event) {
				console.log('page loaded: ' + event.url);
				var currentUrl = event.url;
				
				//user cancels the request
				if(currentUrl.indexOf('https://www.facebook.com/guiatwittertest3/?denied') >= 0 ){
					console.log('manageBrowser rejected');					
					browser.close();
					manageBrowserProm.rejected();
				}
				
				if (currentUrl === oauthOptions.callbackUrl) {
					console.log('manageBrowser rejected');					
                    browser.close();
                    manageBrowserProm.rejected();
                }
				
				if(currentUrl.indexOf('https://www.facebook.com/guiatwittertest3?') >= 0){		 
					console.log('verifier ' + currentUrl);
                    var verifier = getQueryVariable(currentUrl, 'oauth_verifier');
                    var oauth_token = getQueryVariable(currentUrl, 'oauth_token');
                    
                    oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+verifier+'&oauth_token='+oauth_token, function(data) {
                    	console.log('data.text: ' + data.text);
                    	var oauth_token = getQueryVariable(data.text, 'oauth_token');
                    	var oauth_token_secret = getQueryVariable(data.text, 'oauth_token_secret');		                    	
                        oauth.setAccessToken([oauth_token, oauth_token_secret]);
                        
                        // Save access token/key in localStorage
                        var accessData = {};
                        accessData.accessTokenKey = oauth_token;
                        accessData.accessTokenSecret = oauth_token_secret; 
                        var localStorageService = new LocalStorageService();
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
		
		function verifyCredentials() {
			console.log('verifyCredentials called 1');
			var verifyCredentials = new $.Deferred();
			var localStorageService = new LocalStorageService();
			var storedAccessData = localStorageService.get('accessData');			
			if(storedAccessData){
				oauthOptions.accessTokenKey = storedAccessData.accessTokenKey;
				oauthOptions.accessTokenSecret = storedAccessData.accessTokenSecret;	
				oauth = OAuth(oauthOptions);
		        oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true', function() {
		        	console.log('verifyCredentials resolved');
	                verifyCredentials.resolve();
				}, function() {
		        	oauthOptions.accessTokenKey = '';
		        	oauthOptions.accessTokenSecret = '';
		        	localStorageService.set('accessData', null);
		        	console.log('verifyCredentials rejected 2');
					verifyCredentials.reject();
				});
			} else {
				console.log('verifyCredentials rejected 2');
				verifyCredentials.reject()
			}
			
			return verifyCredentials.promise();
		}
		
		function publishTweet() {
			console.log('publishTweet called');
			oauth.post('https://api.twitter.com/1.1/statuses/update.json',{ 'status' : twitText,  // jsOAuth encodes for us
                'trim_user' : 'true' }, function() {  
                	cordovaServices.alert($translate('publishTwitter'), $translate('publishTitle'), $translate('publishOk'));
            		console.log('publishTweet resolved');                	
			},
			function() {
				publishFailure();
				console.log('publishTweet rejected');
			});		
		}
		
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
			cordovaServices.alert($translate('publishFail'), $translate('publishTitle'), $translate('publishOk'));
		}

		return twitterServiceFactory;
	};

	guiaEncuentroApp.factory('twitterService', [ 'cordovaServices', '$translate', 'localStorageService', twitterService ]);
});