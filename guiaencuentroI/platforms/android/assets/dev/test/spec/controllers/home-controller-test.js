/**
 * Home controller tests
 */

describe('homeController', function() {
  'use strict';
  var CURRENT_DATE = '2/16/2011';
  // load the controller's module
  beforeEach(module('guiaEncuentroApp'));

  var homeController;
  var scope;
  var cordovaServices;
  var navigationService;
  var userSettingsService;

  // initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {

    userSettingsService = jasmine.createSpyObj('userSettingsService', [
      'getSelectedDate',
      'saveSelectedDate'
    ]);
    userSettingsService.getSelectedDate = function() {
    };
    spyOn(userSettingsService, 'getSelectedDate').andReturn(CURRENT_DATE);
    
    cordovaServices = jasmine.createSpyObj('cordovaServices', [
      'exitApp'
    ]);
    navigationService = jasmine.createSpyObj('navigationService', [
      'slidePage'
    ]);

    scope = $rootScope.$new();
    homeController = $controller('HomeController', {
      $scope : scope,
      cordovaServices : cordovaServices,
      navigationService : navigationService,
      userSettingsService : userSettingsService
    });
  }));

  it('must have the current date as selected date', function() {
    expect(scope.selectedDate).toBe(CURRENT_DATE);
  });

  it('must persist selected', function() {
    scope.persistSelectedDate();
    expect(userSettingsService.saveSelectedDate).toHaveBeenCalledWith(CURRENT_DATE);
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
