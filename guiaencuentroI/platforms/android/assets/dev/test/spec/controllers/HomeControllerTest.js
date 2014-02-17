/**
 * Home controller tests
 */

define([ 'app', 'guiaEncuentroApp', 'homeController3' ], function(app,
		guiaEncuentroApp) {
	describe('homeController3', function() {
		'use strict';

		// load the controller's module
		beforeEach(module('guiaEncuentroApp'));

		var homeController, scope;

		// initialize the controller and a mock scope
		beforeEach(inject(function($controller, $rootScope) {
			scope = $rootScope.$new();
			homeController = $controller('HomeController3', {
				$scope : scope
			});
		}));

		it('must have the current date as selected date', function() {
			expect(scope.selectedDate).toBe('2/16/2011');
		});

		it('must have the current date as selected date', function() {
			expect(scope.selectedDate).toBe('2/16/201l');
		});
	});
});