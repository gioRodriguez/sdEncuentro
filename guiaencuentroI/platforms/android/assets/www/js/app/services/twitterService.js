/**
 * twitter service
 */

define([ 'codebird', 'cordovaServices' ], function(Codebird) {
	var twitterService = function(cordovaServices, localStorageService) {
		var twitterServiceFactory = {};
		var cb = new Codebird;
		var aouthOoptions = { 
	            consumerKey: 'xnBHedrb9KkhgokvnZMmg',
	            consumerSecret: '6sDkd3ZEP1CRInrQunNfnqWfGKB4CKBsgmnEDPxWBBA',
	            callbackUrl: 'https://www.facebook.com/guiatwittertest3' };
		cb.setConsumerKey("xnBHedrb9KkhgokvnZMmg",
				"6sDkd3ZEP1CRInrQunNfnqWfGKB4CKBsgmnEDPxWBBA");
		var requestParams = null;
		twitterServiceFactory.publish = function() {
			cb.__call("oauth_requestToken", {
				oauth_callback : "https://www.facebook.com/guiatwittertest3"
			}, function(reply) {
				// stores it
				cb.setToken(reply.oauth_token, reply.oauth_token_secret);
				
				var oauth_token = reply.oauth_token;
				var oauth_token_secret = reply.oauth_token_secret;
				console.log('oauth_token: ' + reply.oauth_token);
				console.log('oauth_token_secret: ' + reply.oauth_token_secret);
				
				// gets the authorize screen URL
				cb.__call("oauth_authorize", {}, function(auth_url) {
					
					console.log('auth_url: ' + auth_url);
					
					var browser = cordovaServices.openBrowser(auth_url);
					browser.addEventListener('loadstart', function(event) {
						console.log('page loaded: ' + event.url);
						var currentUrl = event.url;
						
						//user cancels the request
						if(currentUrl.indexOf('https://www.facebook.com/guiatwittertest3/?denied') >= 0 ){
							browser.close();
						}
						
						if (currentUrl === "http://www.your-apps-homepage.com/") {
		                    $('#oauthStatus').html('<span style="color:red;">User declined access</span>');
		                    return;
		                }
						
						if(currentUrl.indexOf('https://www.facebook.com/guiatwittertest3?') >= 0){
							var index, verifier = '';            
		                    var params = currentUrl.substr(currentUrl.indexOf('?') + 1);
		                    
		                    params = params.split('&');
		                    for (var i = 0; i < params.length; i++) {
		                        var y = params[i].split('=');
		                        if(y[0] === 'oauth_verifier') {
		                            verifier = y[1];
		                        }
		                    }
		                    
		                    console.log('verifier: ' + verifier);
		                    var oauth = OAuth(aouthOoptions);
		                    
		                    oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+verifier+'&oauth_token='+oauth_token
		                    		+'&oauth_token_secret='+oauth_token_secret, function(data) {
		                    	var accessParams = {};
                                var qvars_tmp = data.text.split('&');
                                for (var i = 0; i < qvars_tmp.length; i++) {
                                    var y = qvars_tmp[i].split('=');
                                    accessParams[y[0]] = decodeURIComponent(y[1]);
                                }
                                console.log('AppLaudLog: ' + accessParams.oauth_token + ' : ' + accessParams.oauth_token_secret);
                                oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
                                
                                // Save access token/key in localStorage
                                var accessData = {};
                                accessData.accessTokenKey = accessParams.oauth_token;
                                accessData.accessTokenSecret = accessParams.oauth_token_secret;                                
                                browser.close();
                                oauth.post('https://api.twitter.com/1.1/statuses/update.json',{ 'status' : 'guia encuentro test',  // jsOAuth encodes for us
                                    'trim_user' : 'true' }, function(data) {
                                    	var entry = JSON.parse(data.text);
                                    	console.log("AppLaudLog: Tweet id: " + entry.id_str + " text: " + entry.text);                               	
								},
								function(data) {
									console.log("AppLaudLog: Error during tweet " + data.text);
								});
									}, function(data) {
										console.log("AppLaudLog: 1 Error " + data); 
									});
						}
					});
					
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