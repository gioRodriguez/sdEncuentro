/**
 * Text viewer controller test
 */
define(
		[ 'guiaEncuentroApp', 'textViewerController' ],
		function() {
			describe(
					'textViewerController test',
					function() {
						'use strict';

						beforeEach(module('guiaEncuentroApp'));

						var textViewerController
						, scope
						, localStorageService
						, dataServices
						, constantsService
						, controller
						, navigationService
						, facebookService
						, cordovaServices
						, $translate
						, twitterService;

						beforeEach(function() {
							navigationService = jasmine.createSpyObj('navigationService',
									[ 'back' ])
							localStorageService = jasmine.createSpyObj('localStorageService',
									[ 'get', 'set' ]);
							localStorageService.get = function() {
							}

							dataServices = jasmine.createSpy('dataServices');
							dataServices.getTextByDate = function() {
							}
							spyOn(dataServices, 'getTextByDate').andReturn({
								done : function(func) {
									func('<ul><li>text for today</li></ul>');
									return {
										fail : function() {
										}
									};
								}
							});

							cordovaServices = jasmine.createSpyObj('cordovaServices',
									[ 'alert', 'exitApp' ]);

							constantsService = jasmine.createSpyObj('constantsService',
									[ 'defaultFontSize' ]);
							constantsService.defaultFontSize = 0;

							inject(function($controller, $rootScope) {
								scope = $rootScope.$new();
								controller = $controller;
							})

						});

						it('must publish to facebook', function() {
							// arrange
							var translateKeys = [];
							$translate = function(translateKey) {
								translateKeys.push(translateKey);
								return 'messageFake';
							}
							facebookService = jasmine.createSpyObj('facebookService',
									[ 'publish' ]);
							facebookService.publish = function() {
							}
							spyOn(facebookService, 'publish').andReturn({
								done : function(func) {
									func('success');
									return {
										fail : function() {
										}
									};
								}
							});
							textViewerController = controller('TextViewerController', {
								$scope : scope,
								localStorageService : localStorageService,
								dataServices : dataServices,
								constantsService : constantsService,
								navigationService : navigationService,
								cordovaServices : cordovaServices,
								facebookService : facebookService,
								$translate : $translate
							});

							// act
							scope.facebookPublish();

							// assert
							expect(facebookService.publish).toHaveBeenCalledWith(
									'text for today...');
							expect(translateKeys).toEqual(
									[ 'publishFacebook', 'publishTitle', 'publishOk' ]);
							expect(cordovaServices.alert).toHaveBeenCalledWith('messageFake',
									'messageFake', 'messageFake');
						});
						
						it('must publish to twitter', function() {
							// arrange
							twitterService = jasmine.createSpyObj('twitterService',
									[ 'publish' ]);
							twitterService.publish = function() {
							}
							spyOn(twitterService, 'publish').andReturn({
								done : function(func) {
									func('success');
									return {
										fail : function() {
										}
									};
								}
							});
							textViewerController = controller('TextViewerController', {
								$scope : scope,
								localStorageService : localStorageService,
								dataServices : dataServices,
								constantsService : constantsService,
								navigationService : navigationService,
								cordovaServices : cordovaServices,
								twitterService : twitterService,
								$translate : $translate
							});

							// act
							scope.twitterPublish();

							// assert
							expect(twitterService.publish).toHaveBeenCalledWith(
									'text for today...');
						});

						it('must call navigation back when back', function() {
							// arrange
							textViewerController = controller('TextViewerController', {
								$scope : scope,
								localStorageService : localStorageService,
								dataServices : dataServices,
								constantsService : constantsService,
								navigationService : navigationService
							});

							// act
							scope.back();

							// assert
							expect(navigationService.back).toHaveBeenCalled();
						});
						
						it('must call cordova exit when exit', function() {
							// arrange
							textViewerController = controller('TextViewerController', {
								$scope : scope,
								localStorageService : localStorageService,
								dataServices : dataServices,
								constantsService : constantsService,
								navigationService : navigationService,
								cordovaServices : cordovaServices
							});

							// act
							scope.exit();

							// assert
							expect(cordovaServices.exitApp).toHaveBeenCalled();
						});

						it(
								'must apply font plus and disable plus when the max font size is reached',
								function() {
									// arrange
									var fontSize = 5;
									spyOn(localStorageService, 'get').andReturn(fontSize);
									textViewerController = controller('TextViewerController', {
										$scope : scope,
										localStorageService : localStorageService,
										dataServices : dataServices,
										constantsService : constantsService
									});

									// act
									scope.plusFontSize();

									// assert
									expect(localStorageService.set).toHaveBeenCalledWith(
											'fontSize', fontSize + 1);
									expect(scope.userPreferredFontSize).toBe('xx-large');
									expect(scope.disableMinFontSize).toBeFalsy();
									expect(scope.disablePlusFontSize).toBeTruthy();
								});

						it(
								'must apply font min and disable min when the min font size is reached',
								function() {
									// arrange
									var fontSize = 1;
									spyOn(localStorageService, 'get').andReturn(fontSize);
									textViewerController = controller('TextViewerController', {
										$scope : scope,
										localStorageService : localStorageService,
										dataServices : dataServices,
										constantsService : constantsService
									});

									// act
									scope.minFontSize();

									// assert
									expect(localStorageService.set).toHaveBeenCalledWith(
											'fontSize', fontSize - 1);
									expect(scope.userPreferredFontSize).toBe('xx-small');
									expect(scope.disableMinFontSize).toBeTruthy();
									expect(scope.disablePlusFontSize).toBeFalsy();
								});

						it('must load user preferred font size from local storage',
								function() {
									// arrange
									spyOn(localStorageService, 'get').andReturn(4);
									textViewerController = controller('TextViewerController', {
										$scope : scope,
										localStorageService : localStorageService,
										dataServices : dataServices,
										constantsService : constantsService
									});

									// act

									// assert
									expect(scope.userPreferredFontSize).toBe('large');
								});

						it('must load the text by the selected day', function() {
							// arrange
							spyOn(localStorageService, 'get').andReturn('4-febrero-2012');
							textViewerController = controller('TextViewerController', {
								$scope : scope,
								localStorageService : localStorageService,
								dataServices : dataServices,
								constantsService : constantsService
							});

							// act

							// assert
							expect(scope.selectedDate).toBe('4-febrero-2012');
							expect(dataServices.getTextByDate).toHaveBeenCalledWith(
									'4-febrero-2012');
							expect(scope.text).toBe('<ul><li>text for today</li></ul>');
						});

						it(
								'must use preferred font size from constanst when local storage is null',
								function() {
									// arrange
									spyOn(localStorageService, 'get').andReturn(undefined);
									textViewerController = controller('TextViewerController', {
										$scope : scope,
										localStorageService : localStorageService,
										dataServices : dataServices,
										constantsService : constantsService
									});

									// act

									// assert
									expect(scope.userPreferredFontSize).toBe('xx-small');
									expect(localStorageService.get).toHaveBeenCalledWith(
											'fontSize');
								});
					});
		});