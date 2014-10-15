/**
 * Text viewer controller test
 */
describe(
    'textViewerController test',
    function() {
      'use strict';

      var CONSTANTS =
        {
          textForToday : " DESEADO DE TODAS LAS GENTES, PAG. 217-218 Lucas 4:31-44 Reina-Valera 1960 (RVR1960) Un hombre que tenía un espíritu inmundo (Mr. 1.21-28) 31 Descendió Jesús a Capernaum, ciudad de Galilea; y les enseñaba en los días de reposo.[a] 32 Y se admiraban de su doctrina, porque su palabra era con autoridad. 33 Estaba en la sinagoga un hombre que tenía un espíritu de demonio inmundo, el cual exclamó a gran voz, 34 diciendo: Déjanos; ¿qué tienes con nosotros, Jesús nazareno? ¿Has venido para destruirnos? Yo te conozco quién eres, el Santo de Dios. 35 Y Jesús le reprendió, diciendo: Cállate, y sal de él...",
          textForTodayHTML : "<div class='readHeader'><ul><li><span></span><h1>﻿Lectura del Año Bíblico del Plan Encuentro III</h1></li><li><span></span><h2>1 de Abril</h2></li><li><span></span><h3>Lucas 4:31:44</h3></li></ul></div><hr><div class='readBoby'><p>DESEADO DE TODAS LAS GENTES, PAG. 217-218</p><p>Lucas 4:31-44</p><p>Reina-Valera 1960 (RVR1960)</p><p>Un hombre que tenía un espíritu inmundo</p><p>(Mr. 1.21-28)</p><p>31 Descendió Jesús a Capernaum, ciudad de Galilea; y les enseñaba en los días de reposo.[a]</p><p>32 Y se admiraban de su doctrina, porque su palabra era con autoridad.</p><p>33 Estaba en la sinagoga un hombre que tenía un espíritu de demonio inmundo, el cual exclamó a gran voz,</p><p>34 diciendo: Déjanos; ¿qué tienes con nosotros, Jesús nazareno? ¿Has venido para destruirnos? Yo te conozco quién eres, el Santo de Dios.</p><p>35 Y Jesús le reprendió, diciendo: Cállate, y sal de él. Entonces el demonio, derribándole en medio de ellos, salió de él, y no le hizo daño alguno.</p><p>36 Y estaban todos maravillados, y hablaban unos a otros, diciendo: ¿Qué palabra es esta, que con autoridad y poder manda a los espíritus inmundos, y salen?</p><p>37 Y su fama se difundía por todos los lugares de los contornos.</p><p>Jesús sana a la suegra de Pedro</p><p>(Mt. 8.14-15; Mr. 1.29-31)</p><p>38 Entonces Jesús se levantó y salió de la sinagoga, y entró en casa de Simón. La suegra de Simón tenía una gran fiebre; y le rogaron por ella.</p><p>39 E inclinándose hacia ella, reprendió a la fiebre; y la fiebre la dejó, y levantándose ella al instante, les servía.</p><p>Muchos sanados al ponerse el sol</p><p>(Mt. 8.16-17; Mr. 1.32-34)</p><p>40 Al ponerse el sol, todos los que tenían enfermos de diversas enfermedades los traían a él; y él, poniendo las manos sobre cada uno de ellos, los sanaba.</p><p>41 También salían demonios de muchos, dando voces y diciendo: Tú eres el Hijo de Dios. Pero él los reprendía y no les dejaba hablar, porque sabían que él era el Cristo.</p><p>Jesús recorre Galilea predicando</p><p>(Mr. 1.35-39)</p><p>42 Cuando ya era de día, salió y se fue a un lugar desierto; y la gente le buscaba, y llegando a donde estaba, le detenían para que no se fuera de ellos.</p><p>43 Pero él les dijo: Es necesario que también a otras ciudades anuncie el evangelio del reino de Dios; porque para esto he sido enviado.</p><p>44 Y predicaba en las sinagogas de Galilea.</p><p>Notas al pie:</p><p>    Lucas 4:31 Aquí equivale a sábado.</p><p>EL DESEADO DE TODAS LAS GENTES - PÁGINAS 217 Y 218.</p><p>  DURANTE los intervalos que transcurrían entre sus viajes de un lugar a otro, Jesús moraba en Capernaúm, y esta localidad llegó a ser conocida como \"su ciudad.\" Estaba a orillas del mar de Galilea, y cerca de los confines de la hermosa llanura de Genesaret, si no en realidad sobre ella.</p><p>    La profunda depresión del lago da a la llanura que rodea sus orillas el agradable clima del sur. Allí prosperaban en los días de Cristo la palmera y el olivo; había huertos y viñedos, campos verdes y abundancia de flores para matizarlos alegremente, todo regado por arroyos cristalinos que brotaban de las peñas. Las orillas del lago y los collados que lo rodeaban a corta distancia, estaban tachonados de aldeas y pueblos. El lago estaba cubierto de barcos pesqueros. Por todas partes, se notaba la agitación de una vida activa.</p><p>    Capernaúm misma se prestaba muy bien para ser el centro de la obra del Salvador. Como se encontraba sobre el camino de Damasco a Jerusalén y Egipto y al mar Mediterráneo, era un punto de mucho tránsito. Gente de muchos países pasaba por la ciudad, o quedaba allí a descansar en sus viajes de un punto a otro. Allí Jesús podía encontrarse con representantes de todas las naciones y de todas las clases sociales, tanto ricos y encumbrados, como pobres y humildes, y sus lecciones serían llevadas a otras naciones y a muchas familias. Así se fomentaría la investigación de las profecías, la atención sería atraída al Salvador, y su misión sería presentada al mundo.</p><p>    A pesar de la acción del Sanedrín contra Jesús, la gente esperaba ávidamente el desarrollo de su misión. Todo el cielo estaba conmovido de interés. Los ángeles estaban preparando el terreno para su ministerio, obrando en los corazones humanos y atrayéndolos al Salvador.</p><p>    En Capernaúm, el hijo del noble a quien Cristo había sanado era un testigo de su poder. Y el oficial de la corte y 218 su familia testificaban gozosamente de su fe. Cuando se supo que el Maestro mismo estaba allí, toda la ciudad se conmovió. Multitudes acudieron a su presencia. El sábado, la gente llenó la sinagoga a tal punto que muchos no pudieron entrar.</p><p>    Todos los que oían al Salvador \"se maravillaban de su doctrina, porque su palabra era con potestad.\" \"Porque les enseñaba como quien tiene autoridad, y no como los escribas.' (Lucas 4:32, Mateo 7:29) La enseñanza de los escribas y ancianos era fría y formalista, como una lección aprendida de memoria. Para ellos, la Palabra de Dios no tenía poder vital. Habían substituido sus enseñanzas por sus propias ideas y tradiciones. En la rutina de las ceremonias profesaban explicar la ley, pero ninguna inspiración de Dios conmovía su corazón ni el de sus oyentes.</p><p>    Jesús no tenía nada que ver con los diversos temas de disensión entre los judíos. Su obra era presentar la verdad. Sus palabras derramaban raudales de luz sobre las enseñanzas de los patriarcas y profetas, y presentaban las Escrituras a los hombres como una nueva revelación. Nunca habían percibido sus oyentes tan profundo significado en la Palabra de Dios. Jesús se encontraba con la gente en su propio terreno, como quien está familiarizado con sus perplejidades. Hacía hermosa la verdad presentándola de la manera más directa y sencilla. Su lenguaje era puro, refinado y claro como un arroyo cristalino. Su hablar era como música para los que habían escuchado las voces monótonas de los rabinos. Pero aunque su enseñanza era sencilla, hablaba como persona investida de autoridad. Esta característica ponía su enseñanza en contraste con la de todos los demás. Los rabinos hablaban con duda y vacilación, como si se pudiese entender que las Escrituras tenían un significado u otro exactamente opuesto. Los oyentes estaban diariamente envueltos en mayor incertidumbre. Pero al enseñar, Jesús presentaba las Escrituras como autoridad indudable. Cualquiera que fuese su tema, lo exponía con poder, con palabras incontrovertibles. </p></div>"
        };
      beforeEach(module('guiaEncuentroApp'));

      var textViewerController;
      var rootScope;
      var scope;
      var textService;
      var controller;
      var navigationService;
      var facebookService;
      var cordovaServices;
      var $translate;
      var twitterService;
      var usSpinnerService;
      var $timeout;
      var $routeParams;
      var userSettingsService;
      var httpBackend;
      var dialogService;
      var scrollService;
      var TextViewerModelFacty;

      beforeEach(function() {
        TextViewerModelFacty = jasmine.createSpyObj('TextViewerModelFacty', [
          'isFooterVisible',
          'init',
          'isHigthConstrastEnabled',
          'turnOnTurnOffHigthConstrast',
          'getUserPreferredFontSize',
          'setUserPreferredFontSize',
          'plusMinFont',
          'getTextByDate',
          'facebookPublish'
        ]);    
        TextViewerModelFacty.text = CONSTANTS.textForTodayHTML;
        TextViewerModelFacty.facebookPublish = function() {
        };
        spyOn(TextViewerModelFacty, 'facebookPublish').andReturn({
          then: function(fn){
            fn();
            return {
              then: function(){}
            };
          }
        });
        TextViewerModelFacty.getTextByDate = function() {
        };
        spyOn(TextViewerModelFacty, 'getTextByDate').andReturn({
          then: function(fn){
            fn();
          }
        });
        TextViewerModelFacty.isHigthConstrastEnabled = function() {
        };
        spyOn(TextViewerModelFacty, 'isHigthConstrastEnabled').andReturn(true);
        TextViewerModelFacty.getUserPreferredFontSize = function() {
        };
        spyOn(TextViewerModelFacty, 'getUserPreferredFontSize').andReturn('2.5rem');
        
        navigationService = jasmine.createSpyObj('navigationService', [
          'back'
        ]);

        userSettingsService = jasmine.createSpyObj('userSettingsService', [
          'isHighConstrastEnabled',
          'turnOffHighConstrast',
          'turnOnHighConstrast',
          'getPreferedFontSize',
          'savePreferedFontSize'
        ]);
        userSettingsService.getPreferedFontSize = function() {
        };
        spyOn(userSettingsService, 'getPreferedFontSize').andReturn('5');
        userSettingsService.isHighConstrastEnabled = function() {
        };
        spyOn(userSettingsService, 'isHighConstrastEnabled').andReturn(true);

        textService = jasmine.createSpy('textService');
        textService.getTextByDate = function() {
        }
        spyOn(textService, 'getTextByDate').andReturn({
          done : function(func) {
            func(CONSTANTS.textForTodayHTML);
            return {
              fail : function() {
              }
            };
          }
        });

        cordovaServices = jasmine.createSpyObj('cordovaServices', [
          'alert',
          'exitApp',
          'isNetworkAvailable'
        ]);
        cordovaServices.isNetworkAvailable = function() {
          return true;
        };

        scrollService = jasmine.createSpyObj('scrollService', ['applyScroll']);
        
        $timeout = function(func) {
          func();
        }

        $routeParams = {
          selectedDateParam : '2012-febrero-4'
        };

        inject(function($controller, $rootScope, $httpBackend) {
          rootScope = $rootScope;
          scope = $rootScope.$new();
          controller = $controller;
          httpBackend = $httpBackend;
        })

        httpBackend.expectGET('views/home.html').respond({ hello: 'World' });
        
        $translate = function(translateKey) {
          var messages = {
            textAskedFailDesc : 'textAskedFailDesc',
            textAskedFailTitle : 'textAskedFailTitle',
            publishOk : 'publishOk'
          }
          return messages[translateKey] ? messages[translateKey] : 'messageFake';
        }

        usSpinnerService = jasmine.createSpyObj('usSpinnerService', [
          'spin',
          'stop'
        ]);
        
        dialogService = jasmine.createSpyObj('dialogService', ['showError', 'showInfo']);

        textViewerController = controller('TextViewerController', {
          $scope : scope,
          textService : textService,
          navigationService : navigationService,
          cordovaServices : cordovaServices,
          facebookService : facebookService,
          $translate : $translate,
          usSpinnerService : usSpinnerService,
          $timeout : $timeout,
          $routeParams : $routeParams,
          dialogService : dialogService,
          scrollService: scrollService,
          TextViewerModelFacty: TextViewerModelFacty
        });
      });

      it('must show error when there is not network and try to publish offline', function() {
        // arrange
        $translate = function(translateKey) {
          var messages = {
            notNetworkTitle : 'notNetworkTitle',
            notNetworkDesc : 'notNetworkDesc',
            publishOk : 'publishOk'
          }
          return messages[translateKey] ? messages[translateKey] : 'messageFake';
        }
        facebookService = jasmine.createSpyObj('facebookService', [
          'publish'
        ]);
        facebookService.publish = function() {
        }
        var deferred = $.Deferred();
        spyOn(facebookService, 'publish').andCallFake(function() {
          return deferred.promise();
        });
        deferred.reject(exceptions.notNetworkException());

        usSpinnerService = jasmine.createSpyObj('usSpinnerService', [
          'spin',
          'stop'
        ]);

        textViewerController = controller('TextViewerController', {
          $scope : scope,
          textService : textService,
          navigationService : navigationService,
          cordovaServices : cordovaServices,
          facebookService : facebookService,
          $translate : $translate,
          usSpinnerService : usSpinnerService,
          $timeout : $timeout,
          dialogService : dialogService,
          TextViewerModelFacty: TextViewerModelFacty
        });

        // act
        scope.facebookPublish();

        // assert
        //expect(dialogService.showError).toHaveBeenCalledWith('notNetworkDesc');
      });

      it('must publish to facebook and disable the button', function() {
        // arrange
        var $timeout = function(func) {
          func();
        }
        $translate = function(translateKey) {
          var messages = {
            publicationLink : 'appLink',
            publicationPicture : 'appPicture',
            publicationAppName : 'appName',
            publicationAppCaption : 'appCaption'
          }
          return messages[translateKey] ? messages[translateKey] : 'messageFake';
        }
        facebookService = jasmine.createSpyObj('facebookService', [
          'publish'
        ]);
        facebookService.publish = function() {
        }
        spyOn(facebookService, 'publish').andReturn({
          then : function(func) {
            func('success');
            return {
              fail : function() {
              }
            };
          }
        });

        usSpinnerService = jasmine.createSpyObj('usSpinnerService', [
          'spin',
          'stop'
        ]);

        textViewerController = controller('TextViewerController', {
          $scope : scope,
          textService : textService,
          navigationService : navigationService,
          cordovaServices : cordovaServices,
          facebookService : facebookService,
          $translate : $translate,
          usSpinnerService : usSpinnerService,
          $timeout : $timeout,
          dialogService : dialogService,
          TextViewerModelFacty: TextViewerModelFacty
        });

        var publication = {
          message : CONSTANTS.textForToday,
          link : 'appLink',
          picture : 'appPicture',
          name : 'appName',
          caption : 'appCaption'
        }

        // act
        scope.facebookPublish();

        // assert
        expect(TextViewerModelFacty.facebookPublish).toHaveBeenCalled();
        //expect(scope.disableFacebook).toBe(false);
        //expect(usSpinnerService.spin).toHaveBeenCalledWith('publishSpin');
        //expect(usSpinnerService.stop).toHaveBeenCalledWith('publishSpin');
        //expect(dialogService.showInfo).toHaveBeenCalledWith('publishFacebook');
      });

      it('must cancell publish to facebook when there are not selected text', function() {
        // arrange
        textService = jasmine.createSpy('textService');
        textService.getTextByDate = function() {
        };
        spyOn(textService, 'getTextByDate').andReturn({
          done : function(func) {
            func(undefined);
            return {
              fail : function() {
              }
            };
          }
        });
        facebookService = jasmine.createSpyObj('facebookService', [
          'publish'
        ]);

        scope = rootScope.$new();
        textViewerController = controller('TextViewerController', {
          $scope : scope,
          textService : textService,
          facebookService : facebookService,
          usSpinnerService: usSpinnerService,
          $timeout: $timeout,
          TextViewerModelFacty: TextViewerModelFacty
        });

        // act
        scope.facebookPublish();
        
        
        // assert
        expect(usSpinnerService.spin).toHaveBeenCalledWith('publishSpin');
        expect(TextViewerModelFacty.facebookPublish).toHaveBeenCalled();
        expect(usSpinnerService.stop).toHaveBeenCalledWith('publishSpin');
        expect(scope.disableFacebook).toBe(false);
      });

      it(
          'must apply font plus and disable plus when the max font size is reached',
          function() {
            // arrange
            var $timeout = function(func) {
              func();
            }
            var fontSize = 9;
            userSettingsService.getPreferedFontSize = function() {
            };
            spyOn(userSettingsService, 'getPreferedFontSize').andReturn(fontSize);

            TextViewerModelFacty.plusMinFont = function() {
            };
            spyOn(TextViewerModelFacty, 'plusMinFont').andReturn({
              fontSize: '5rem',
              disablePlusFontSize: true,
              disableMinFontSize: false
            });
            
            scope = rootScope.$new();
            textViewerController = controller('TextViewerController', {
              $scope : scope,
              textService : textService,
              $timeout : $timeout,
              userSettingsService : userSettingsService,
              TextViewerModelFacty: TextViewerModelFacty
            });

            // act
            
            scope.plusFontSize();            
            scope.$apply();

            // assert
            expect(scope.userPreferredFontSize).toBe('5rem');
            expect(scope.disableMinFontSize).toBeFalsy();
            expect(scope.disablePlusFontSize).toBeTruthy();
          });

      it(
          'must apply font min and disable min when the min font size is reached',
          function() {
            // arrange
            var fontSize = 2;
            userSettingsService.getPreferedFontSize = function() {
            };
            spyOn(userSettingsService, 'getPreferedFontSize').andReturn(fontSize);
            
            TextViewerModelFacty.plusMinFont = function() {
            };
            spyOn(TextViewerModelFacty, 'plusMinFont').andReturn({
              fontSize: '0.5rem',
              disablePlusFontSize: false,
              disableMinFontSize: true
            });
            
            scope = rootScope.$new();
            textViewerController = controller('TextViewerController', {
              $scope : scope,
              textService : textService,
              $timeout : $timeout,
              userSettingsService : userSettingsService,
              TextViewerModelFacty: TextViewerModelFacty
            });

            // act
            scope.minFontSize();
            scope.$apply();

            // assert
            expect(scope.userPreferredFontSize).toBe('0.5rem');
            expect(scope.disableMinFontSize).toBeTruthy();
            expect(scope.disablePlusFontSize).toBeFalsy();
          });

      it('must load user settings', function() {
        // arrange
        scope = rootScope.$new();
        textViewerController = controller('TextViewerController', {
          $scope : scope,
          textService : textService,
          $timeout : $timeout,
          userSettingsService : userSettingsService,
          TextViewerModelFacty: TextViewerModelFacty
        });

        // act
        scope.$apply();

        // assert
        expect(scope.userPreferredFontSize).toBe('2.5rem');
        expect(TextViewerModelFacty.isHigthConstrastEnabled).toHaveBeenCalled();
        expect(TextViewerModelFacty.getUserPreferredFontSize).toHaveBeenCalled();
      });

      it('must turn off high constract when the user does', function() {
        // arrange
        textViewerController = controller('TextViewerController', {
          $scope : scope,
          textService : textService,
          $timeout : $timeout,
          userSettingsService : userSettingsService,
          TextViewerModelFacty: TextViewerModelFacty
        });

        // act
        scope.setContrast();

        // assert
        expect(TextViewerModelFacty.turnOnTurnOffHigthConstrast).toHaveBeenCalled();
      });

      it('must turn on high constract when the user does', function() {
        // arrange
        userSettingsService.isHighConstrastEnabled = function() {
        };
        spyOn(userSettingsService, 'isHighConstrastEnabled').andReturn(false);

        TextViewerModelFacty.isHigthConstrastEnabled = function() {
        };
        spyOn(TextViewerModelFacty, 'isHigthConstrastEnabled').andReturn(false);
        
        scope = rootScope.$new();
        textViewerController = controller('TextViewerController', {
          $scope : scope,
          textService : textService,
          $timeout : $timeout,
          userSettingsService : userSettingsService,
          TextViewerModelFacty: TextViewerModelFacty
        });

        // act
        scope.setContrast();

        // assert
        expect(TextViewerModelFacty.turnOnTurnOffHigthConstrast).toHaveBeenCalled();
      });

      it('must load the text by the selected day', function() {
        // arrange

        // act

        // assert
        expect(scope.selectedDate).toBe('2012-febrero-4');
        expect(TextViewerModelFacty.getTextByDate).toHaveBeenCalledWith('2012-febrero-4');
        expect(scope.text).toBe(CONSTANTS.textForTodayHTML);
        expect(scrollService.applyScroll).toHaveBeenCalled();
      });

      it('must show error dialog when the loaded text is invalid', function() {
        // arrange
        $routeParams = {
          selectedDateParam : ''
        };
        textService = jasmine.createSpy('textService');
        textService.getTextByDate = function() {
        };
        spyOn(textService, 'getTextByDate').andReturn({
          done : function(func) {
            return {
              fail : function(func) {
                func();
              }
            };
          }
        });

        scope = rootScope.$new();
        textViewerController = controller('TextViewerController', {
          $scope : scope,
          textService : textService,
          $translate : $translate,
          cordovaServices : cordovaServices,
          $timeout : $timeout,
          $routeParams : $routeParams,
          dialogService : dialogService,
          TextViewerModelFacty: TextViewerModelFacty
        });

        // act

        // assert
        //expect(scope.selectedDate).toBe('');
        //expect(textService.getTextByDate).toHaveBeenCalledWith('');
        //expect(dialogService.showError).toHaveBeenCalledWith('textAskedFailDesc');
      });
    });