/**
 * Home controller tests
 */

describe('homeController', function() {
  'use strict';
  var CURRENT_DATE = '2/16/2011';
  // load the controller's module
  beforeEach(module('guiaEncuentroApp'));

  var homeController, scope, localStorageService, cordovaServices, navigationService;

  // initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    localStorageService = jasmine.createSpyObj('localStorageService', [
      'set'
    ]);
    localStorageService.get = function() {
    };
    spyOn(localStorageService, 'get').andReturn(CURRENT_DATE);
    cordovaServices = jasmine.createSpyObj('cordovaServices', [
      'exitApp'
    ]);
    navigationService = jasmine.createSpyObj('navigationService', [
      'slidePage'
    ]);

    scope = $rootScope.$new();
    homeController = $controller('HomeController', {
      $scope : scope,
      localStorageService : localStorageService,
      cordovaServices : cordovaServices,
      navigationService : navigationService
    });
  }));

  it('must have the current date as selected date', function() {
    expect(scope.selectedDate).toBe(CURRENT_DATE);
  });

  it('must persist selected data to local storage', function() {
    scope.persistSelectedDate();
    expect(localStorageService.set).toHaveBeenCalledWith('selectedDate', CURRENT_DATE);
  });

  it('must call cordova exit app on exit', function() {
    scope.exit();
    expect(cordovaServices.exitApp).toHaveBeenCalled();
  });

  it('must call nav service slidePage on slidePage', function() {
    scope.slidePage();
    expect(navigationService.slidePage).toHaveBeenCalled();
  });
});
