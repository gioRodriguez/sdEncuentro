/**
 * Home Controller
 */
(function() {
  var homeController =
    function(
        $scope,
        navigationService,
        cordovaServices,
        userSettingsService) {
      function init() {
        $scope.selectedDate = userSettingsService.getSelectedDate();
      };

      $scope.slidePage = function(path, type) {
        navigationService.slidePage(path, type);
      };
      
      $scope.goTextReader = function() {
        navigationService.slidePage('/textViewer/' + $scope.selectedDate);
      };

      $scope.persistSelectedDate = function() {
        userSettingsService.saveSelectedDate($scope.selectedDate);
      };

      $scope.exit = function() {
        cordovaServices.exitApp();
      };
      
      init();
    };

  angular.module('guiaEncuentroApp').controller('HomeController', [
    '$scope',
    'navigationService',
    'cordovaServices',
    'userSettingsService',
    homeController
  ]);
})();