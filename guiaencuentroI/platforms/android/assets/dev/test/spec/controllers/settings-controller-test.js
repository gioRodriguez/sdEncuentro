/**
 * Settings controller test
 */

describe(
    'settings controller test',
    function() {
      'use strict';
      beforeEach(module('guiaEncuentroApp'));

      var unitUtils = new UnitUtils();
      
      var settingsController;
      var controller;
      var SettingsModelFacty;    

      beforeEach(inject(function($controller) {
        controller = $controller;

        SettingsModelFacty = jasmine.createSpyObj('SettingsModelFacty', [
          'getUserPreferredLanguage',
          'setUserPreferredLanguage',
          'removeFacebookAccount',
          'turnOnTurnOffContinueReading',
          'isSaraiMessageVisible',
          'isContinueReadingActive'
        ]);
        unitUtils.mockWithReturnValue(SettingsModelFacty, 'getUserPreferredLanguage', 'us');
        unitUtils.mockWithReturnValue(SettingsModelFacty, 'isSaraiMessageVisible', true);

        settingsController = $controller('SettingsController', {
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
        var actual = settingsController.hideSaraiMessage;

        // assert
        expect(actual).toBeThruty;
      });

      it('must do facebook logout when there is an account', function() {
        // arrange
        settingsController = controller('SettingsController', {
          SettingsModelFacty: SettingsModelFacty
        });

        // act
        settingsController.removeFacebookAccount();

        // assert
        expect(SettingsModelFacty.removeFacebookAccount).toHaveBeenCalled();
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