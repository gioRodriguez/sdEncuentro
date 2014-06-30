/*
 * Error service to show the errors messages
 */

(function() {
  var dialogService = function(cordovaServices, $translate) {
    var dialogServiceFactory = {};

    dialogServiceFactory.showError = function(messageKey) {
      cordovaServices.alert(
          $translate(messageKey),
          $translate('errorTitle'),
          $translate('publishOk')
      );
    };
    
    dialogServiceFactory.showInfo = function(messageKey) {
      cordovaServices.alert(
          $translate(messageKey),
          $translate('infoTitle'),
          $translate('publishOk')
      );
    };

    return dialogServiceFactory;
  };

  angular.module('guiaEncuentroApp').factory('dialogService', [
    'cordovaServices',
    '$translate',
    dialogService
  ]);
})();