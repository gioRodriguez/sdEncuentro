/**
 * facebook service test
 */

define([ 'guiaEncuentroApp', 'facebookService' ], function(guiaEncuentroApp) {
	describe('facebookService test', function() {
		'use strict';

		beforeEach(module('guiaEncuentroApp'));

		var injector, facebookService;

		beforeEach(function() {
			var CDV = jasmine.createSpyObj('CDV', [ 'FB' ]);
			window.CDV = CDV;
			var FB = jasmine.createSpyObj('FB', [
					'init',
					'api',
					'getLoginStatus',
					'Dom',
					'Event',
					'login',
					'logout']);
			FB.Event.fire = function() {
			};
			FB.Event.clear = function() {
			};
			FB.getLoginStatus = function() {
			};
			FB.login = function() {
			};
			FB.logout = function() {
			};
			FB.api = function() {
			};
			spyOn(FB, 'api').andCallFake(function(url, method, mesage, callback) {
				callback();
			});
			window.FB = FB;

			inject(function($injector) {
				injector = $injector
			});
		});
		
		it('must do facebook logout', function() {
			// arrange
			spyOn(FB, 'logout').andCallFake(function(logoutCallback) {
				logoutCallback();
			});
			var facebookService = injector.get('facebookService');
			
			// act
			var logoutPromise = facebookService.logout();
			
			// assert
			expect(FB.logout).toHaveBeenCalled();
			expect(logoutPromise.state()).toBe('resolved');
		});
		
		it('must resolve if there is a facebook account valid', function() {
			// arrange
			spyOn(FB, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
				loginStatusCallback({
					authResponse : true
				});
			});
			var facebookService = injector.get('facebookService');
			
			// act
			var hasActiveAccountPromise = facebookService.hasActiveAccount();
			
			// assert
			expect(hasActiveAccountPromise.state()).toBe('resolved');
		});
		
		it('must reject if there is a facebook account valid', function() {
			// arrange
			spyOn(FB, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
				loginStatusCallback({
					authResponse : false
				});
			});
			var facebookService = injector.get('facebookService');
			
			// act
			var hasActiveAccountPromise = facebookService.hasActiveAccount();
			
			// assert
			expect(hasActiveAccountPromise.state()).toBe('rejected');
		});

		it('must directly publish when has a previous login active', function() {
			// arrange
			spyOn(FB, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
				loginStatusCallback({
					authResponse : true
				});
			});
			var facebookService = injector.get('facebookService');

			// act
			var publishPromise = facebookService.publish('hello world');

			// assert
			expect(FB.init).toHaveBeenCalled();
			expect(FB.api).toHaveBeenCalledWith('/me/feed', 'post', {
				message : 'hello world'
			}, jasmine.any(Function));
			expect(publishPromise.state()).toBe('resolved');
		});

		it('must ask login and publish if the login was successful', function() {
			// arrange
			spyOn(FB, 'login').andCallFake(function(loginCallback) {
				loginCallback({
					authResponse : true
				});
			});
			spyOn(FB, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
				loginStatusCallback({
					authResponse : false
				});
			});
			var facebookService = injector.get('facebookService');

			// act
			var publishPromise = facebookService.publish('hello world');

			// assert
			expect(FB.init).toHaveBeenCalled();
			expect(FB.login).toHaveBeenCalledWith(jasmine.any(Function), {
				scope : 'email'
			});
			expect(FB.api).toHaveBeenCalledWith('/me/feed', 'post', {
				message : 'hello world'
			}, jasmine.any(Function));
			expect(publishPromise.state()).toBe('resolved');
		});

		it('must reject the the publish if the login was unsuccessful', function() {
			// arrange
			spyOn(FB, 'login').andCallFake(function(loginCallback) {
				loginCallback({
					authResponse : false
				});
			});
			spyOn(FB, 'getLoginStatus').andCallFake(function(loginStatusCallback) {
				loginStatusCallback({
					authResponse : false
				});
			});
			var facebookService = injector.get('facebookService');

			// act
			var publishPromise = facebookService.publish('hello world');

			// assert
			expect(FB.init).toHaveBeenCalled();
			expect(FB.login).toHaveBeenCalledWith(jasmine.any(Function), {
				scope : 'email'
			});
			expect(publishPromise.state()).toBe('rejected');
		});		
	});
});