/**
 * Settings controller test
 */

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
      var cordovaServices;
      var navigationService;
      var facebookService;
      var userSettingsService;
      var dialogService;

      beforeEach(inject(function($controller, $rootScope) {
        controller = $controller;
        rootScope = $rootScope;

        $translate = jasmine.createSpyObj('$translate', [
          'uses'
        ]);

        $translate.uses = function() {
        }
        spyOn($translate, 'uses').andReturn('us');

        cordovaServices = jasmine.createSpyObj('cordovaServices', [
          'exitApp',
          'alert'
        ]);

        navigationService = jasmine.createSpyObj('navigationService', [
          'back'
        ]);

        facebookService = jasmine.createSpyObj('facebookService', [
          'hasActiveAccount',
          'logout'
        ]);

        userSettingsService = jasmine.createSpyObj('userSettingsService', [
          'savePreferredLanguage',
          'turnOnContinueReading',
          'turnOffContinueReading'
        ]);

        dialogService = jasmine.createSpyObj('dialogService', [
          'showError',
          'showInfo'
        ]);

        scope = $rootScope.$new();
        settingsController = $controller('SettingsController', {
          $scope : scope,
          $translate : $translate,
          cordovaServices : cordovaServices,
          navigationService : navigationService,
          facebookService : facebookService,
          userSettingsService : userSettingsService
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

      it('must do facebook logout when there is an account', function() {
        // arrange
        facebookService.hasActiveAccount = function() {
        };
        var deferred = $.Deferred();
        spyOn(facebookService, 'hasActiveAccount').andCallFake(function() {
          return deferred.promise();
        });
        deferred.resolve();

        facebookService.logout = function() {
        };
        var logountDeferred = $.Deferred();
        spyOn(facebookService, 'logout').andCallFake(function() {
          return logountDeferred.promise();
        });
        logountDeferred.resolve();

        $translate = function() {
        };
        $translate.uses = function() {
        };

        settingsController = controller('SettingsController', {
          $scope : scope,
          $translate : $translate,
          cordovaServices : cordovaServices,
          navigationService : navigationService,
          facebookService : facebookService,
          dialogService : dialogService
        });

        // act
        scope.removeFacebookAccount();

        // assert
        expect(facebookService.logout).toHaveBeenCalled();
      });

      it('must alert that there is not a facebook account', function() {
        // arrange
        facebookService.hasActiveAccount = function() {
        };
        var deferred = $.Deferred();
        spyOn(facebookService, 'hasActiveAccount').andCallFake(function() {
          return deferred.promise();
        });
        deferred.reject();

        var messages = {
          notAccountAlertMsg : 'notAccountAlertMsg',
          accountAlertTitle : 'accountAlertTitle',
          publishOk : 'publishOk'
        };
        $translate = function(key) {
          return messages[key];
        };
        $translate.uses = function() {
        };

        settingsController = controller('SettingsController', {
          $scope : scope,
          $translate : $translate,
          cordovaServices : cordovaServices,
          navigationService : navigationService,
          facebookService : facebookService,
          dialogService : dialogService
        });

        // act
        scope.removeFacebookAccount();

        // assert
        expect(dialogService.showInfo).toHaveBeenCalledWith('notAccountAlertMsg');
      });

      it('must alert that there is not network available', function() {
        // arrange
        facebookService.hasActiveAccount = function() {
        };
        var deferred = $.Deferred();
        spyOn(facebookService, 'hasActiveAccount').andCallFake(function() {
          return deferred.promise();
        });
        deferred.reject(exceptions.notNetworkException());

        var messages = {
          notNetworkDesc : 'notNetworkDesc',
          notNetworkTitle : 'notNetworkTitle',
          publishOk : 'publishOk'
        };
        $translate = function(key) {
          return messages[key];
        };
        $translate.uses = function() {
        };

        settingsController = controller('SettingsController', {
          $scope : scope,
          $translate : $translate,
          cordovaServices : cordovaServices,
          navigationService : navigationService,
          facebookService : facebookService,
          dialogService : dialogService
        });

        // act
        scope.removeFacebookAccount();

        // assert
        expect(dialogService.showError).toHaveBeenCalledWith('notNetworkDesc');
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

      it('must change the preferred languaje selected by the user', function() {
        // arrange
        scope.preferredLanguage = 'es';

        // act
        scope.changePreferredLanguage();

        // assert
        expect($translate.uses).toHaveBeenCalledWith('es');
        expect(userSettingsService.savePreferredLanguage).toHaveBeenCalledWith('es');
      });

      it('must turn off the continue reading selected by the user', function() {
        // arrange
        scope.isContinueReadingActive = false;

        // act
        scope.turnOnTurnOffContinueReading();

        // assert
        expect(userSettingsService.turnOffContinueReading).toHaveBeenCalled();
      });

      it('must turn off the continue reading selected by the user', function() {
        // arrange
        scope.isContinueReadingActive = true;

        // act
        scope.turnOnTurnOffContinueReading();

        // assert
        expect(userSettingsService.turnOnContinueReading).toHaveBeenCalled();
      });

      it('must call cordova exit app on exit', function() {
        // arrange

        // act
        scope.exit();

        // assert
        expect(cordovaServices.exitApp).toHaveBeenCalled();
      });

      it(
          'must show enabled facebook remove account when is has a facebook account saved it',
          function() {
            // arrange

            // act
            scope.exit();

            // assert
            expect(cordovaServices.exitApp).toHaveBeenCalled();
          });
    });