/**
 * Settings controller test
 */

define(
		[ 'guiaEncuentroApp', 'settingsController' ],
		function() {
			describe(
					'settings controller test',
					function() {
						'use strict';
						beforeEach(module('guiaEncuentroApp'));

						var settingsController, scope, $translate, localStorageService, cordovaServices, navigationService;

						beforeEach(inject(function($controller, $rootScope) {
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

							scope = $rootScope.$new();
							settingsController = $controller('SettingsController', {
								$scope : scope,
								$translate : $translate,
								localStorageService : localStorageService,
								cordovaServices : cordovaServices,
								navigationService : navigationService
							});
						}));

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
					});
		});