/**
 * Home controller tests
 */

describe('homeController', function() {
  'use strict';
  var CURRENT_DATE = '2/16/2011';
  // load the controller's module
  beforeEach(module('guiaEncuentroApp'));

  var homeController;
  var HomeModelFacty;

  // initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    
    HomeModelFacty = jasmine.createSpyObj('HomeModelFacty', [
      'getSelectedDate',
      'setSelectedDate',
      'goToSettingsPage',
      'goToTextViewerPage',
      'setFormInfo'
    ]);
    HomeModelFacty.getSelectedDate = function() {
    };
    spyOn(HomeModelFacty, 'getSelectedDate').andReturn(CURRENT_DATE);
    HomeModelFacty.setFormInfo = function() {
    };
    spyOn(HomeModelFacty, 'setFormInfo').andReturn(HomeModelFacty);


    homeController = $controller('HomeController', {
      HomeModelFacty: HomeModelFacty
    });
    
    homeController.homeForm = {};
  }));

  it('must have the current date as selected date', function() {
    expect(homeController.selectedDate).toBe(CURRENT_DATE);
  });

  it('must persist selected', function() {
    homeController.setSelectedDate();
    expect(HomeModelFacty.setSelectedDate).toHaveBeenCalledWith(CURRENT_DATE);
  });

  it('must can go to settings page', function() {
    homeController.goToSettingsPage();
    expect(HomeModelFacty.goToSettingsPage).toHaveBeenCalled();
  });
  
  it('must can go to text viewer page with selected date', function() {
    homeController.goToTextViewerPage();
    expect(HomeModelFacty.goToTextViewerPage).toHaveBeenCalledWith(CURRENT_DATE);
  });
});
