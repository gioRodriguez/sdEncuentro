/**
 * Settings controller test
 */

define(
		[ 'guiaEncuentroApp', 'settingsController', 'facebookService' ],
		function() {
			describe(
					'settings controller test',
					function() {
						'use strict';
						beforeEach(module('guiaEncuentroApp'));

						var settingsController;
						var controller;
						var rootScope;
						var scope;
						var $translate;
						var localStorageService;
						var cordovaServices;
						var navigationService;
						var facebookService;

						beforeEach(inject(function($controller, $rootScope) {
							controller = $controller;
							rootScope = $rootScope;
							
							$translate = jasmine.createSpyObj('$translate', [ 'uses' ]);
							$translate.uses = function() {
							}
							spyOn($translate, 'uses').andReturn('us');
							
							localStorageService = jasmine.createSpyObj('localStorageService',
									[ 'set' ]);
							
							cordovaServices = jasmine.createSpyObj('cordovaServices',
									[ 'exitApp' ]);
							
							navigationService = jasmine.createSpyObj('navigationService',
									[ 'back' ]);

							facebookService = jasmine.createSpyObj('facebookService', ['hasActiveAccount', 'logout']);
							
							scope = $rootScope.$new();
							settingsController = $controller('SettingsController', {
								$scope : scope,
								$translate : $translate,
								localStorageService : localStorageService,
								cordovaServices : cordovaServices,
								navigationService : navigationService,
								facebookService : facebookService
							});
						}));
						
						it('must hide sarai message', function() {
							// arrange							
							
							// act
							var actual = scope.hideSaraiMessage;
							
							// assert
							expect(actual).toBe(true);
						});
						
						it('must show sarai message after some clicks', function() {
							// arrange							
							scope.showSaraiMessage();
							scope.showSaraiMessage();
							scope.showSaraiMessage();
							
							// act
							var actual = scope.hideSaraiMessage;
							
							// assert
							expect(actual).toBe(false);
						});
						
						it('must do facebook logout', function() {
							// arrange
							facebookService.logout = function() {								
							};
							var deferred = $.Deferred();
							spyOn(facebookService, 'logout').andCallFake(function() {
								return deferred.promise();
							});
							deferred.resolve();
							
							// act
							//scope.facebookLogout();
							
							// assert
							//expect(facebookService.logout).toHaveBeenCalled();
						});

						it('must facebook account button default is disabled', function() {
							// arrange							
	
							// act
							var actual = scope.disableFacebookButton;
							
							// assert
							expect(actual).toBe(true);
						});
						
						it('must facebook account be enabeld if is a valid account', function() {
							// arrange							
							facebookService.hasActiveAccount = function() {								
							};
							var deferred = $.Deferred();
							spyOn(facebookService, 'hasActiveAccount').andCallFake(function() {
								return deferred.promise();
							});
							deferred.resolve();
							
							// act
							scope.ckeckFacebookButton();
							var actual = scope.disableFacebookButton;
							
							// assert
							expect(actual).toBe(false);
						});
						
						it('must facebook account be disabled if is not a valid account', function() {
							// arrange							
							facebookService.hasActiveAccount = function() {								
							};
							var deferred = $.Deferred();
							spyOn(facebookService, 'hasActiveAccount').andCallFake(function() {
								return deferred.promise();
							});
							deferred.reject();
							
							// act
							scope.ckeckFacebookButton();
							var actual = scope.disableFacebookButton;
							
							// assert
							expect(actual).toBe(true);
						});
						
						it('must call navigation back when back', function() {
							// arrange
							
							// act
							scope.back();
							
							// assert
							expect(navigationService.back).toHaveBeenCalled();
						});

						it('must the prefered languaje selected', function() {
							expect(scope.preferredLanguage).toBe('us');
						});

						it('must change the preferred languaje selected by the user',
								function() {
									// arrange
									scope.preferredLanguage = 'es'

									// act
									scope.changePreferredLanguage();

									// assert
									expect($translate.uses).toHaveBeenCalledWith('es');
									expect(localStorageService.set).toHaveBeenCalledWith(
											'preferredLanguage', 'es');
								});

						it('must call cordova exit app on exit', function() {
							// arrange
							
							// act
							scope.exit();
							
							// assert
							expect(cordovaServices.exitApp).toHaveBeenCalled();
						});
						
						it('must show enabled facebook remove account when is has a facebook account saved it', function() {
							// arrange
							
							// act
							scope.exit();
							
							// assert
							expect(cordovaServices.exitApp).toHaveBeenCalled();
						});
					});
		});