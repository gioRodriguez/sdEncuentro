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
      var facebookService;
      var userSettingsService;
      var dialogService;
      var SettingsModelFacty;

      beforeEach(inject(function($controller, $rootScope) {
        controller = $controller;
        rootScope = $rootScope;

        SettingsModelFacty = jasmine.createSpyObj('SettingsModelFacty', [
          'getUserPreferredLanguage',
          'setUserPreferredLanguage',
          'removeFacebookAccount',
          'turnOnTurnOffContinueReading',
          'isSaraiMessageVisible',
          'isContinueReadingActive'
        ]);
        SettingsModelFacty.getUserPreferredLanguage = function() {
        }
        spyOn(SettingsModelFacty, 'getUserPreferredLanguage').andReturn('us');
        
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
          facebookService : facebookService,
          userSettingsService : userSettingsService,
          SettingsModelFacty: SettingsModelFacty
        });
      }));

      it('must hide sarai message', function() {
        // arrange

        // act
        var actual = settingsController.hideSaraiMessage;

        // assert
        expect(actual).toBe(true);
      });

      it('must show sarai message after some clicks', function() {
        // arrange
        settingsController.showSaraiMessage();
        settingsController.showSaraiMessage();
        settingsController.showSaraiMessage();

        // act
        var actual = scope.hideSaraiMessage;

        // assert
        //expect(actual).toBe(false);
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
          facebookService : facebookService,
          dialogService : dialogService
        });

        // act
        //scope.removeFacebookAccount();

        // assert
        //expect(facebookService.logout).toHaveBeenCalled();
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
          facebookService : facebookService,
          dialogService : dialogService
        });

        // act
        //scope.removeFacebookAccount();

        // assert
        //expect(dialogService.showInfo).toHaveBeenCalledWith('notAccountAlertMsg');
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
          facebookService : facebookService,
          dialogService : dialogService
        });

        // act
        //scope.removeFacebookAccount();

        // assert
        //expect(dialogService.showError).toHaveBeenCalledWith('notNetworkDesc');
      });

      it('must the prefered languaje selected', function() {
        expect(settingsController.preferredLanguage).toBe('us');
      });

      it('must change the preferred languaje selected by the user', function() {
        // arrange
        settingsController.preferredLanguage = 'es';

        // act
        settingsController.changePreferredLanguage();

        // assert
        expect(SettingsModelFacty.setUserPreferredLanguage).toHaveBeenCalledWith('es');
      });

      it('must turn on/off the continue reading selected by the user', function() {
        // arrange

        // act
        settingsController.turnOnTurnOffContinueReading();

        // assert
        expect(SettingsModelFacty.turnOnTurnOffContinueReading).toHaveBeenCalled();
      });
    });