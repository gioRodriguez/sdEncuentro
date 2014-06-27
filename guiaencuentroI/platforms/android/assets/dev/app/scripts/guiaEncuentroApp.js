/**
 * Sd Encuentro App
 */
(function() {
  var CONSTANST =
    {
      appLink : 'https://play.google.com/store/apps/details?id=com.sd.encuentrocatorce',
      appPicture : 'https://lh4.googleusercontent.com/-3dahp2cXhd0/U3F4Slu04uI/AAAAAAAAAEk/-6G0i_nRW6I/s200-no/icon.png'
    };

  angular
      .module('guiaEncuentroApp', [
        'ngRoute',
        'ngTouch',
        'ajoslin.mobile-navigate',
        'pascalprecht.translate',
        'ngSanitize',
        'angularSpinner'
      ])
      .config(
          [
            '$routeProvider',
            '$translateProvider',
            function($routeProvider, $translateProvider) {
              $routeProvider.when('/', {
                templateUrl : 'views/home.html',
                controller : 'HomeController'
              });
              $routeProvider.when('/textViewer/:selectedDateParam', {
                templateUrl : 'views/text-viewer.html',
                controller : 'TextViewerController'
              });
              $routeProvider.when("/settings", {
                templateUrl : "views/settings.html",
                controller : "SettingsController"
              });
              $routeProvider.otherwise({
                redirectTo : '/'
              });

              // i18n
              $translateProvider
                  .translations(
                      'es',
                      {
                        homeTitle : 'Plan Encuentro 3',
                        selectionDate : 'Fecha de lectura deseada:',
                        settingsTitle : 'Opciones',
                        accounts : 'Cuentas',
                        deleteFacebookAccount : 'Remover facebook',
                        accountAlertTitle : 'cuenta',
                        accountAlertMsg : 'sesión cerada',
                        about : 'Acerca de',
                        poweredBy : 'Powered por ',
                        toSarai : 'Especial dedicación a Saraí :)',
                        goReading : 'Ir a lectura',
                        welcome : 'Escudriñad las Escrituras; porque a vosotros os parece que en ellas tenéis la vida eterna; y ellas son las que dan testimonio de mí (Juan 5:39)',
                        spanish : 'Español',
                        english : 'Ingles',
                        publishTitle : 'Compartido',
                        publishFacebook : 'Compartido en facebook gracias :)',
                        publishTwitter : 'Compartido en twitter gracias :)',
                        publishFail : 'Lo sentimos ha ocurrido un error :(',
                        publishOk : 'Aceptar',
                        publicationLink : CONSTANST.appLink,
                        publicationPicture : CONSTANST.appPicture,
                        publicationAppName : 'Año Bíblico del Plan Encuentro III',
                        publicationAppCaption : 'Esta aplicación es gratuita y te permite leer el año bíblico 2014, que se titula "Cristo, nuestra redención"',
                        notNetworkDesc : 'Necesitamos acceso a internet para compartir',
                        notNetworkTitle : 'Problemas de conectividad',
                        textAskedFailDesc : 'Lo sentimos ha ocurrido un error con la fecha seleccionada',
                        textAskedFailTitle : 'Selección de lectura',
                        notAccountAlertMsg : 'No hay cuenta de facebook',
                        readSettings: 'Lecturas',
                        continueReadSetting: 'Continuar lectura'
                      });

              $translateProvider
                  .translations(
                      'en',
                      {
                        homeTitle : 'Meet Plan 3',
                        selectionDate : 'Choise a date:',
                        settingsTitle : 'Settings',
                        accounts : 'Accounts',
                        deleteFacebookAccount : 'Remove facebook',
                        accountAlertTitle : 'Account',
                        accountAlertMsg : 'Account closed',
                        about : 'About',
                        poweredBy : 'Powered by ',
                        goReading : 'Go to reading',
                        toSarai : 'Speccially dedicated to Sarai :)',
                        welcome : 'You study the Scriptures diligently because you think that in them you have eternal life. These are the very Scriptures that testify about me (John 5:39)',
                        spanish : 'Spanish',
                        english : 'English',
                        publishTitle : 'Publish',
                        publishFacebook : 'Shared in facebook thank you :)',
                        publishTwitter : 'Shared in twitter thank you :)',
                        publishFail : "We're so sorry an error has been occurred :(",
                        publishOk : 'Ok',
                        publicationLink : CONSTANST.appLink,
                        publicationPicture : CONSTANST.appPicture,
                        publicationAppName : 'Biblic Year Meet Plan III',
                        publicationAppCaption : 'This application it is free and allow you to read the biblic year 2014',
                        notNetworkDesc : 'We need internet access for publish',
                        notNetworkTitle : 'Connectivity throubles',
                        textAskedFailDesc : 'We so sorry, has been ocurred an error with the asked read',
                        textAskedFailTitle : 'Read asked',
                        notAccountAlertMsg : 'There is not a facebook account',
                        readSettings: 'Reads',
                        continueReadSetting: 'Continuar lectura'
                      });
              $translateProvider.preferredLanguage('es');
            }
          ]);

  angular.module('guiaEncuentroApp').initialize = function() {
  };

})();

$(function() {
  document.addEventListener('deviceready', onDeviceReady, false);
});

$(document).ready(
    function() {
      FastClick.attach(document.body);

      Modernizr.addTest('svgasimg', document.implementation.hasFeature(
          'http://www.w3.org/TR/SVG11/feature#Image',
          '1.1'));
    });

function onDeviceReady() {
  console.log('device ready');
}
